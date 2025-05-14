import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountResetPassword } from "../controller/authController";
import logoImage from '../assets/cyvex-logo.png';

const ResetUserPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handlePasswordUpdate = async (e) =>{
        const response = await AccountResetPassword(newPassword);
        navigate("/login/email");
    };

    return (
    <div className="bg-blue-950 w-screen h-screen flex flex-col items-center justify-center gap-6">
        <img 
          src={logoImage} 
          alt="Cyvex Logo" 
          className="h-10 w-auto" // adjust height/width to fit your design
        />
            <div className="bg-stone-50 p-8 flex flex-col items-center justify-center gap-4 rounded-md shadow-lg w-100">
                <p className="text-black text-3xl font-regular">Reset Password</p>
                <p className="text-black text-lg font-regular">enter your new password</p>
                <input
					type="password"
					placeholder="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
                    className="font-bold p-3 w-60 bg-white text-black opacity-50 border border-blue-950 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handlePasswordUpdate}
                    className="w-60 !bg-blue-950 text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none"
                >
                Submit
                </button>
        </div>
    </div>
    );
};

export default ResetUserPassword;