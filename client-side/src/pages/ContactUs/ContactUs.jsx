/**
 * @fileoverview ContactUs page - This page is used to send feedback to the admin.
 */
import React, { useState,useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast"
import { Link } from 'react-router-dom';

import { cn } from "../../lib/utils";
import { BackgroundBeamsWithCollision } from "../../components/ui/background_beams_with_collision";
import FeedbackAPI from "../../api/feedBackAPI"
import Footer from '../../components/Footer/Footer';

function ContactUs() {

  useEffect(()=>{
    toast.dismiss();
},[])

  // Form data state.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Form errors state.
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle change function to update the formdata state.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to validate the form data.
  function validateFeedBackform() {
    //Email generic regex.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};

    // Check if the username is empty.
    if (!formData.name.trim()) newErrors.username = "Name is required";

    // Check if the email is empty and is in incorrect format.
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";

    // Check if the message is empty.
    if (!formData.message.trim()) newErrors.cfID = "Message is required";

    return newErrors;
  }

  // Handle submit function to submit the feedback.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form data and set the errors state if any.
    const validationErrors = validateFeedBackform();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Submit the feedback.
    const response = await FeedbackAPI.submitFeedback(formData);

    // Show the toast message based on the response.
    if (response.success) {
      toast.success(response.message, {
        duration: 2000,
        className: "toast-success"
      })
    }
    else {
      toast.error(response.message, {
        duration: 2000,
        className: "toast-error"
      })
    }

    // Reset the form data and loading state.
    setFormData({ name: "", email: "", message: "" })
    setLoading(false)
  };

  return (
    <>
      {/* Background  meteors falling and collision effect */}
      <BackgroundBeamsWithCollision>
        <div className="md:mt-10 w-screen h-screen flex items-center text-white md:px-0 px-5">
          <div className="max-w-md w-full border-[#3E3E8E] mx-auto rounded-lg p-6 shadow-2xl border">

            {/* Header */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-[#D1D1FF] mb-6">
              Contact Us
            </h1>

            <form onSubmit={handleSubmit}>

              {/* Name field */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                >
                  Name
                </label>
                <input
                  name="name"
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  //Add class to show red border if name is empty
                  className={cn(
                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                    errors.name && "border-red-500"
                  )}
                />
                {/* Show error message if name is empty */}
                {errors.name && (
                  <p className="text-red-500 text-xs">{errors.name}</p>
                )}
              </div>

              {/* Email  field*/}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                >
                  Email
                </label>
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  //Add class to show red border if name is empty
                  className={cn(
                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                    errors.email && "border-red-500"
                  )}
                />
                {/* Show error message if email is empty */}
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              {/* Message field*/}
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm md:text-base font-semibold text-[#C5C5FF] mb-2"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="4"
                  //Add class to show red border if name is empty.
                  className={cn(
                    "w-full p-2 md:p-3 rounded border focus:outline-none focus:border-blue-400 bg-[#121232] text-gray-300 placeholder-gray-500",
                    errors.message && "border-red-500"
                  )}
                />
                {/* Show error message if message is empty */}
                {errors.message && (
                  <p className="text-red-500 text-xs">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 md:py-3 rounded focus:outline-none transition duration-200"
                  disabled={loading}
                >
                  {!loading && "Submit"}
                  {loading && "Submitting..."}
                </button>
              </div>
            </form>

            {/* FAQ link */}
            <p className="mt-4 text-center text-[#C5C5FF]">
              Have any questions?{" "}
              <Link to="/faq" className="text-blue-400 hover:text-blue-500">
                FAQ
              </Link>
            </p>

          </div>

          {/*Show Toast message */}
          <Toaster />
        </div>
      </BackgroundBeamsWithCollision>
      <Footer />
    </>
  );
}


export default ContactUs;