import React, { useState } from "react";
import { loginAdmin } from "../controller/authController"; // Use controller for authentication
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pageNo, setpageNo] = useState(1);
  const navigate = useNavigate();
 
  const handleNext = () => {
    if (!email) {
        alert("Please enter your email.");
        return;
    }
    setpageNo(2);
};

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    const response = await loginAdmin(email, password);

    if (response.error) {
      setError(response.error);
      return;
    } 

    // Store admin login info
    localStorage.setItem("admin", response.username);
    localStorage.setItem("role", response.role);

    // Redirect to admin dashboard
    navigate("/admin/dashboard");
  };

  return (
    <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
      <h4 className="text-stone-50 text-5xl font-bold">cyvex</h4>
      
      <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
        <p className="text-black text-3xl font-regular">Welcome</p>
        <p className="text-black text-lg font-regular">login to access cyvex Admin!</p>
        <form onSubmit={handleAdminLogin} className='flex flex-col items-center justify-center gap-4 rounded-md w-100'>
          {pageNo == "1" && (
            <>            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={handleNext} className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none">
                continue
            </button>
            </>
          )}
          {pageNo == "2" && (
            <>   
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          {error && <p style={{ color: 'red' }}>{error}</p>}  
          <button type="submit" className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none">Login as Admin</button>
          </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
