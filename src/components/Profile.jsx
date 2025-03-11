import React, { useState, useEffect } from "react";
import { fetchAdminProfiles } from "../api/supabaseAPI";

const Profile = () => {
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState(null);
  // Fetch profiles with related subscription data on mount
    useEffect(() => { 
      const getProfiles = async () => {
        var username = localStorage.getItem("username");
        const result = await fetchAdminProfiles(username);
        if (result.error) {
          setError(result.error);
        } else { 
          setProfiles(result.data);
          console.log(" profiles == "+profiles);
        } 
      };
      getProfiles();
    }, []);
	 
	return (
		  <div className="overflow-hidden rounded-sm border-stroke bg-gray-2 shadow-default dark:border-strokedark dark:bg-boxdark">

        <div class="max-w-lg p-6  border border-stroke rounded-lg shadow-sm dark:bg-white dark:border-white">
            <a href="#">
                <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Basic Information</h5>
            </a>
             

            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  User Name
                </h5>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles?.user_metadata?.username}</p>
              </div>            
            </div>

            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                Role 
                </h5>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles[0]?.role}</p>
              </div>            
            </div>

            <a href="#">
                <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Contact Information</h5>
            </a>
 
            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                Email Address
                </h5>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles?.user?.email}</p>
              </div>            
            </div>

            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                Phone Number
                </h5>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles?.user?.phone}</p>
              </div>             
            </div> 

            <a href="#">
                <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">System & Access Information</h5>
            </a>

            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                Date Joined 
                </h5>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles?.user?.created_at}</p>
              </div>            
            </div>

            <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                Last Login
                </h5>
              </div> 
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="hidden text-black dark:text-white sm:block">{profiles?.user?.last_sign_in_at}</p>
              </div>            
            </div>
              
        </div>
    
      </div>
	); 
};

export default Profile; 