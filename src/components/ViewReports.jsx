import React, { useEffect, useState } from "react";
import { getUserProfileNoAuth } from "../controller/userController";
import { listUserFiles, downloadFile, deleteUserFile } from "../controller/uploadController";
import search from "../images/search.jpg";

const ViewReports = () => {
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch user ID and then reports
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get username from localStorage
        const username = localStorage.getItem('username');
        if (!username) {
          throw new Error('Please sign in to continue');
        }

        setIsLoading(true);
        setError(null);
        
        // 2. Fetch user profile
        const { data } = await getUserProfileNoAuth(username);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('User profile not found');
        }

        // 3. Set user ID
        const userObject = data[0];
        const fetchedUserId = userObject?.id;
        if (!fetchedUserId) {
          throw new Error('User ID missing in profile data');
        }

        setUserId(fetchedUserId);
        localStorage.setItem('userId', fetchedUserId);

        // 4. Fetch reports
        await fetchReports(fetchedUserId);
        
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to fetch reports
  const fetchReports = async (userId) => {
	try {
	  setIsLoading(true);
	  const files = await listUserFiles(userId);
	  console.log('Fetched files:', files); // Add this log
	  
	  setReports(files || []); // Ensure we always set an array
	} catch (err) {
	  console.error('Failed to fetch reports:', err);
	  setError(err.message);
	  setReports([]);
	} finally {
	  setIsLoading(false); // This MUST be called
	  console.log('Loading completed'); // Verify this logs
	}
  };

  // Handle report download
  const handleDownload = async (downloadUrl, fileName) => {
	try {
	  setIsLoading(true);
	  setError(null);
  
	  const { success, error } = await downloadFile(downloadUrl, fileName);
	  
	  if (!success) {
		throw new Error(error);
	  }
	} catch (err) {
	  console.error('Download error:', err);
	  setError(err.message || 'Failed to download report');
	} finally {
	  setIsLoading(false);
	}
  };

  // Handle report deletion
	const handleDelete = async (fileId, filePath) => {
	if (!window.confirm('Are you sure you want to delete this report?')) return;
	
	try {
		setDeletingId(fileId);
		setIsLoading(true); // Add this
		
		const { success, error } = await deleteUserFile(userId, filePath);
		if (!success) throw new Error(error);

		await fetchReports(userId); // This will handle its own loading state
		setError(null);
	} catch (err) {
		console.error('Delete failed:', err);
		setError(err.message);
	} finally {
		setDeletingId(null);
		setIsLoading(false); // Ensure loading is always turned off
	}
	};

  return (
    <div className="overflow-hidden rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Reports
          </h3>
          <button 
            onClick={() => fetchReports(userId)}
            className="p-2 !bg-blue-950 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Reports'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">Loading reports...</div>
        ) : error ? (
          <div className="p-6 text-red-500">{error}</div>
        ) : reports.length === 0 ? (
          <div className="p-6 text-center">No security reports found</div>
        ) : (
          <div className="space-y-4 p-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-start mb-2">
                  <div className="w-12 flex-none mr-3">
                    <img src={search} alt="Report" className="w-8 h-8" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-medium text-blue-900 dark:text-blue-200">
                      {report.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(report.createdAt).toLocaleString()}
                    </p>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Size: {(report.metadata?.size).toFixed(0)} Bytes
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
				<button 
					onClick={() => handleDownload(report.downloadUrl, report.name)}
					className="px-4 py-2 !bg-blue-950 text-white rounded"
					disabled={isLoading}
					>
					{isLoading ? 'Downloading...' : 'Download'}
				</button>
                  <button 
                    onClick={() => handleDelete(report.id, report.name)}
                    className="px-4 py-2 !bg-blue-950 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReports;