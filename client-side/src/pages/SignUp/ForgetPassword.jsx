/**
 * @fileoverview ForgetPassword page.
 */
import React, { useState,useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { BackgroundBeamsWithCollision } from "../../components/ui/background_beams_with_collision";
import SendEmail from "./SendEmail";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";

function ForgetPassword() {
    const [step, setStep] = useState(1); // Manage steps (1: Email, 2: OTP, 3: Reset Password)
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");

    // set the data and move to the next step.
    const handleNextStep = (data) => {
        if (step === 1) setEmail(data.email);
        if (step === 2) setOtp(data.otp);
        setStep((step) => step + 1);
    };

    useEffect(()=>{
        toast.dismiss();
    },[])

    return (
        //background beams with collision effect.
        <BackgroundBeamsWithCollision>
            <Toaster />
            {/* Forget Password Form according to the steps */}
            <div className="w-screen h-screen flex items-center justify-center text-white px-5">
                {step === 1 && <SendEmail onNext={handleNextStep} toast={toast} />}
                {step === 2 && <VerifyOTP onNext={handleNextStep} toast={toast} email={email}/>}
                {step === 3 && <ResetPassword toast={toast}/>}
            </div>
        </BackgroundBeamsWithCollision>
    );
}

export default ForgetPassword;
