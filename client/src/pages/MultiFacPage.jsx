import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

const MultiFacPage = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [verificationMethod, setVerificationMethod] = useState('email'); // 'email' or 'phone'
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const inputRefs = useRef([]);

  // Handle digit input
  const handleDigitChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    // Only allow numbers
    if (!/^\d*$/.test(value) && value !== '') {
      return;
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Auto focus to next input after filling current one
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return; // Only allow numbers
    
    const digits = pastedData.slice(0, 6).split('');
    const newOtpDigits = [...otpDigits];
    
    digits.forEach((digit, idx) => {
      if (idx < 6) {
        newOtpDigits[idx] = digit;
      }
    });
    
    setOtpDigits(newOtpDigits);
    
    // Focus the next empty input or the last one if all filled
    const nextEmptyIndex = newOtpDigits.findIndex(d => d === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex].focus();
    } else if (digits.length > 0) {
      inputRefs.current[5].focus();
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer]);

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle resend code
  const handleResendCode = () => {
    // Reset timer and OTP fields
    setTimer(60);
    setIsTimerActive(true);
    setOtpDigits(['', '', '', '', '', '']);
    // Focus first input
    inputRefs.current[0].focus();
    
    // Add implementation for actually resending code here
    console.log('Resending verification code via', verificationMethod);
  };

  // Handle verification
  const handleVerify = (e) => {
    e.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length === 6) {
      console.log('Verifying OTP:', otpCode);
      // Add your OTP verification logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600">Sentinent Stories</h2>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">Verification Required</h1>
          <p className="mt-2 text-gray-600">
            We've sent a verification code to your {verificationMethod}
          </p>
        </div>

        {/* OTP Display info */}
        <div className="flex items-center justify-center mb-6 text-gray-600">
          {verificationMethod === 'email' ? (
            <>
              <Mail className="h-5 w-5 mr-2 text-indigo-500" />
              <span>j***@example.com</span>
            </>
          ) : (
            <>
              <Phone className="h-5 w-5 mr-2 text-indigo-500" />
              <span>+1 (***) ***-4567</span>
            </>
          )}
        </div>

        <form onSubmit={handleVerify}>
          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-8" onPaste={handlePaste}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                maxLength="1"
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {isTimerActive ? (
              <p className="text-gray-600">
                Resend code in <span className="font-semibold">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verification Method Toggle */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => setVerificationMethod(verificationMethod === 'email' ? 'phone' : 'email')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
            >
              Send code to my {verificationMethod === 'email' ? 'phone' : 'email'} instead
            </button>
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                otpDigits.some(digit => digit === '') ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={otpDigits.some(digit => digit === '')}
            >
              Verify
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <a 
              href="#" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiFacPage;