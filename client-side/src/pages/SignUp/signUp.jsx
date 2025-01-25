/**
 * @fileoverview   signup page.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";

import { cn } from "../../lib/utils";
import { BackgroundBeamsWithCollision } from "../../components/ui/background_beams_with_collision";
import { signUp } from "../../redux/slices/authSlice";

function Signup() {

    const navigate = useNavigate();//navigate to the specified route.
    const dispatch = useDispatch();//dispatch an action to the store.
    const { loading, error } = useSelector((state) => state.auth);

    //manage state of the form.
    const [formData, setFormData] = useState({
        username: "",
        cfID: "",
        email: "",
        password: "",
    });

    //manage state of the errors.
    const [errors, setErrors] = useState({});

    //to update state of form data and errors.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    //validate the form data.
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.cfID.trim()) newErrors.cfID = "Codeforces ID is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email))
            newErrors.email = "Invalid email format";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        return newErrors;
    };

    //handle the form submission.
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        //validate the form data.
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        //dispatch the signUp action.
        const resultAction =await dispatch(signUp(formData));
        
        //check signup status.
        if (signUp.fulfilled.match(resultAction)) {
            navigate("/verify-email", { state: { cfID: formData.cfID, email: formData.email } });
        }
        else {
            toast.error(error, {
                duration: 2000,
                className: "toast-error"
            })
        }

    };

    return (
        // background beams with collision effect.
        <BackgroundBeamsWithCollision>
            <div className="mt-10 w-screen h-screen flex  items-center  text-white md:px-0 px-5">
                <div className="max-w-md w-full ] border-[#3E3E8E] mx-auto rounded-lg p-6 shadow-2xl border">

                    {/* Header */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-[#D1D1FF] mb-6">
                        Register Now
                    </h1>

                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                            >
                                Username
                            </label>
                            <input
                                name="username"
                                id="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                // apply styles based on the error.
                                className={cn(
                                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                                    errors.username && "border-red-500"
                                )}
                            />
                            {/* Display error message */}
                            {errors.username && (
                                <p className="text-red-500 text-xs">{errors.username}</p>
                            )}
                        </div>

                        {/* Codeforces ID */}
                        <div className="mb-4">
                            <label
                                htmlFor="cfID"
                                className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                            >
                                Codeforces ID
                            </label>
                            <input
                                name="cfID"
                                id="cfID"
                                type="text"
                                value={formData.cfID}
                                onChange={handleChange}
                                placeholder="Your Codeforces ID"
                                // apply styles based on the error.
                                className={cn(
                                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                                    errors.cfID && "border-red-500"
                                )}
                            />
                            {/* Display error message */}
                            {errors.cfID && (
                                <p className="text-red-500 text-xs">{errors.cfID}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                // apply styles based on the error.
                                className={cn(
                                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                                    errors.email && "border-red-500"
                                )}
                            />
                            {/* Display error message */}
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                            >
                                Password
                            </label>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="****************"
                                // apply styles based on the error.
                                className={cn(
                                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                                    errors.password && "border-red-500"
                                )}
                            />
                            {/* Display error message */}
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-center">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 md:py-3 rounded focus:outline-none transition duration-200"
                                disabled={loading}
                            >
                                {!loading && "Sign Up"}
                                {loading && "Signing Up..."}
                            </button>
                        </div>

                    </form>

                    {/* Login Link */}
                    <p className="mt-4 text-center text-[#C5C5FF]">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400 hover:text-blue-500">
                            Sign In
                        </Link>
                    </p>

                </div>
                {/* Toast messages */}
                <Toaster />
            </div>
        </BackgroundBeamsWithCollision>
    );
}

export default Signup;