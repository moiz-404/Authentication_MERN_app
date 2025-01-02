import React, { useState } from "react";
import { toast } from 'react-toastify'; 

const ResetPasswordOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Handle input changes for each OTP field
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move focus to the next input if filled
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-300 to-purple-500">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-2">Reset password OTP</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to your email id.
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center bg-gray-800 text-white text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordOTP;
