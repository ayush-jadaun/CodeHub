/**
 * @fileoverview Reset Password page - step 3 of ForgetPassword.
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/forgetPassword";

function ResetPassword({toast}) {

    //manage state.
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        toast.dismiss();
    },[])

    const navigate = useNavigate();//navigate to the specified route.
    const api = new API(); //create an instance of API class.

    //handle the form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            //call resetPassword method from API class.
            await api.resetPassword(password);
            toast.success("Password reset successfully!");
            navigate("/login")
        } catch (error) {
            toast.error(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-lg p-6 shadow-2xl bg-[#121232]">
            <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>

            <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">New Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full p-2 rounded bg-[#1E1E3A] text-gray-300 focus:outline-none"
                        required
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full p-2 rounded bg-[#1E1E3A] text-gray-300 focus:outline-none"
                        required
                    />
                </div>

                {/* Reset Password Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
                    disabled={loading}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>

            </form>
        </div>
    );
}

export default ResetPassword;
