import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuthStore } from "../store/authStore";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const isPasting = useRef(false); // To track if the change was due to a paste event
  const navigate = useNavigate();

  const {
    user,
    error,
    isLoading,
    verifyEmail,
    resendVerifyEmail,
    clearErrors,
  } = useAuthStore();

  const handlePaste = (e) => {
    const newCode = [...code];
    isPasting.current = true; // Set the flag for paste event
    const pastedData = e.clipboardData.getData("text/plain");

    const pastedCode = pastedData.slice(0, 6).split("");
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedCode[i] || "";
    }
    setCode(newCode);

    // Focus on the last non-empty input or the first empty one
    const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
    inputRefs.current[focusIndex].focus();
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    // When user paste something (Handle pasted content)
    if (isPasting.current) {
      // Reset the flag and skip handling the onChange event triggered by the paste
      isPasting.current = false;
      return;
    } else {
      //When user enters the code 1 character by 1

      if (value.length > 1) {
        //to ingore the case where user enters more than one chars in the last input
        return;
      }
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  /* When Backspace pressed, change focus on the previous input by getting the previous ref and calling the focus method */
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendVerifyEmail = async (e) => {
    try {
      await resendVerifyEmail(user.email);
      toast.success("Verification email sent. Please check your inbox");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const verificationCode = code.join("");
      try {
        await verifyEmail(verificationCode);
        navigate("/");
        toast.success("Email verified successfully");
      } catch (error) {
        console.log(error);
      }
    },
    [code, verifyEmail, navigate]
  );

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code, handleSubmit]);

  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-700 mb-6 text-base">
          Enter the 6-digit code sent to your email address.
        </p>

        {/*Input =>   dark: bg-gray-700 border-gray-600 text-white
                      light: bg-white border-slate-400 text-black  */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-white text-black border-2 border-slate-400 rounded-lg 
                focus:border-[#0b67e4] focus:outline-none"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 font-semibold mt-2 text-sm">{error}</p>
          )}

          <div className="flex items-center mb-6">
            <Link
              className="text-sm text-[#0B6FF4] hover:underline"
              onClick={handleResendVerifyEmail}
            >
              Resend verification email?
            </Link>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-[#0B6FF4] to-[#1976d2] text-white font-bold py-3 px-4 rounded-lg shadow-lg 
            hover:from-[#095FD7] hover:to-[#1561B0] focus:outline-none focus:ring-2 focus:ring-[#0b67e4] focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
