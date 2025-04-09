import supabase from "../config/supabaseClient";

// Helper function to get user folder based on subscription status
const getUserFolder = async (userId) => {
  // 1. Fetch user profile with subscription status
  const { data: userData, error } = await supabase
    .from('subscription')
    .select('subscribed')
    .eq('id', userId)
    .single();

  // 2. Handle errors (default to standard)
  if (error) {
    console.error('Subscription check failed:', error);
    return {
      bucket: 'standard-user-files',
      path: `user_${userId}/`,
      isPremium: false
    };
  }

  // 3. Return appropriate storage configuration
  return userData.subscribed
    ? {
        bucket: 'premium-user-files',
        path: `user_${userId}/`,
        isPremium: true
      }
    : {
        bucket: 'standard-user-files',
        path: `user_${userId}/`,
        isPremium: false
      };
};

export const uploadUserFile = async (userId, fileContent, options = {}) => {
  try {
    // 1. Determine storage location
    const { bucket, path, isPremium } = await getUserFolder(userId);
    const fileName = options.filename || `${Date.now()}_${isPremium ? 'premium' : 'standard'}.txt`;

    // 2. Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${path}${fileName}`, fileContent, {
        contentType: options.contentType || 'text/plain',
        upsert: options.overwrite || false
      });

    if (error) throw error;

    // 3. Store premium metadata if needed
    if (isPremium && options.metadata) {
      await supabase.from('premium_metadata').insert({
        user_id: userId,
        file_path: `${path}${fileName}`,
        ...options.metadata
      });
    }

    return {
      success: true,
      bucket,
      path: `${path}${fileName}`,
      isPremium
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
};

export const downloadUserFile = async (userId, filePath) => {
  try {
    // 1. Verify user has access to this file
    const { bucket } = await getUserFolder(userId);
    const userFolder = `user_${userId}/`;
    
    if (!filePath.startsWith(userFolder)) {
      throw new Error('Access denied: Invalid file path');
    }

    // 2. Generate download URL
    let downloadUrl;
    if (bucket === 'premium-user-files') {
      const { data: signedUrl } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1-hour expiry
      downloadUrl = signedUrl.signedUrl;
    } else {
      const { data: publicUrl } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      downloadUrl = publicUrl.publicUrl;
    }

    // 3. Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    console.error('Download failed:', error);
    return { success: false, error };
  }
};

export const listUserFiles = async (userId) => {
  try {
    console.log('Fetching storage info for user:', userId);
    const { bucket, path } = await getUserFolder(userId);
    console.log('Storage location:', { bucket, path });

    // Get file list from Supabase storage
    const { data: files, error } = await supabase.storage
      .from(bucket)
      .list(path);

    if (error) {
      console.error('Supabase storage error:', error);
      throw error;
    }
  
    console.log('Raw files from storage:', files);
    
    // Return empty array if no files found
    if (!files || files.length === 0) {
      return [];
    }

    // Process files to get download URLs and metadata
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const { data: urlData } = await supabase.storage
          .from(bucket)
          .createSignedUrl(`${path}/${file.name}`, 3600); // 1 hour expiry

        return {
          id: file.id,
          name: file.name,
          createdAt: file.created_at,
          updatedAt: file.updated_at,
          metadata: file.metadata,
          downloadUrl: urlData?.signedUrl,
          isReport: file.name.endsWith('.json') // Example: identify report files
        };
      })
    );

    return processedFiles;

  } catch (error) {
    console.error('File listing failed:', error);
    throw error; // Re-throw to handle in component
  }
};