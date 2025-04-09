import React, { useEffect, useState } from "react";
import { getUserProfileNoAuth } from "../controller/userController";
import { listUserFiles } from "../controller/uploadController";
import search from "../images/search.jpg";

const ViewReports = () => {
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);

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
      
      // Filter for report files (adjust based on your needs)
      const reportFiles = files.filter(file => file.isReport);
      
      setReports(reportFiles);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err.message);
      setReports([]);
    }
  };

  // Handle report download
  const handleDownload = (downloadUrl, fileName) => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle report deletion
  const handleDelete = async (fileId, fileName) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        // You'll need to implement deleteFile function in your uploadController
        // await deleteFile(userId, fileName);
        await fetchReports(userId); // Refresh the list
      } catch (err) {
        console.error('Failed to delete report:', err);
        setError(err.message);
      }
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
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="font-semibold">File:</span> {report.name}
                  </div>
                  <div>
                    <span className="font-semibold">Last Updated:</span> {new Date(report.updatedAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Size:</span> {(report.metadata?.size / 1024).toFixed(2)} KB
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => handleDownload(report.downloadUrl, report.name)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Download
                  </button>
                  <button 
                    onClick={() => handleDelete(report.id, report.name)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => {/* Implement view functionality */}}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Details
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