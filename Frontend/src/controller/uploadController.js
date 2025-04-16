import supabase from "../config/supabaseClient";

// Helper function to get user folder based on subscription status
export const getUserFolder = async (userId) => {
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

export const downloadFile = async (downloadUrl, fileName) => {
  try {
    if (!downloadUrl) {
      throw new Error('No download URL available');
    }

    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    }, 100);

    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to download file' 
    };
  }
};

export const deleteUserFile = async (userId, filePath) => {
  try {
    // 1. Get user's folder information
    const { bucket, path: userFolderPath } = await getUserFolder(userId);
    
    // 2. Construct and normalize the full file path (not folder)
    const fullFilePath = `${userFolderPath}/${filePath}`
      .replace(/\/+/g, '/')      // Normalize multiple slashes
      .replace(/\/$/, '');       // Remove trailing slash

    // 3. Validate it's a file path (not ending with slash)
    if (fullFilePath.endsWith('/')) {
      throw new Error('Cannot delete folders - path ends with slash');
    }

    // 4. Verify path belongs to user
    if (!fullFilePath.startsWith(`user_${userId}/`)) {
      throw new Error('Unauthorized file access');
    }

    console.log('Deleting file:', fullFilePath);
    
    // 5. Delete only the specific file
    const { error: storageError } = await supabase
      .storage
      .from(bucket)
      .remove([fullFilePath]);  // Array with single file path
    
    if (storageError) throw storageError;

    return { success: true };
  } catch (error) {
    console.error('File deletion failed:', {
      userId,
      filePath,
      error: error.message
    });
    return { 
      success: false,
      error: error.message || 'Failed to delete file' 
    };
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