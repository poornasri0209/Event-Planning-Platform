// // import React, { useState, useEffect, useRef } from 'react';
// // import { ArrowLeft, Mail, Phone, AlertCircle, RefreshCw, Check } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';

// // const MultiFacPage = () => {
// //   const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
// //   const [timer, setTimer] = useState(60);
// //   const [isTimerActive, setIsTimerActive] = useState(true);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [success, setSuccess] = useState('');
// //   const [emailSent, setEmailSent] = useState(false);
// //   const [emailChecked, setEmailChecked] = useState(false);
  
// //   const inputRefs = useRef([]);
// //   const navigate = useNavigate();
// //   const { 
// //     currentUser, 
// //     setNeedsMultiFactor, 
// //     verificationMethod,
// //     setVerificationMethod,
// //     sendVerificationEmail,
// //     setupPhoneVerification,
// //     verifyPhoneOTP,
// //     userPhoneNumber,
// //     setUserPhoneNumber
// //   } = useAuth();

// //   // Send verification when component mounts
// //   useEffect(() => {
// //     const initiateVerification = async () => {
// //       if (!currentUser) {
// //         navigate('/');
// //         return;
// //       }
      
// //       try {
// //         setLoading(true);
        
// //         if (verificationMethod === 'email') {
// //           await sendVerificationEmail();
// //           setEmailSent(true);
// //           setSuccess('Verification email has been sent. Please check your inbox.');
// //         } else {
// //           await setupPhoneVerification();
// //           setSuccess('Verification code sent to your phone.');
// //         }
        
// //         setLoading(false);
// //       } catch (err) {
// //         setError('Failed to send verification: ' + (err.message || 'Please try again.'));
// //         setLoading(false);
// //       }
// //     };
    
// //     initiateVerification();
// //   }, [currentUser, navigate, sendVerificationEmail, setupPhoneVerification, verificationMethod]);

// //   // Handle digit input for phone verification
// //   const handleDigitChange = (index, value) => {
// //     // Only allow single digits
// //     if (value.length > 1) {
// //       value = value.slice(0, 1);
// //     }
    
// //     // Only allow numbers
// //     if (!/^\d*$/.test(value) && value !== '') {
// //       return;
// //     }

// //     const newOtpDigits = [...otpDigits];
// //     newOtpDigits[index] = value;
// //     setOtpDigits(newOtpDigits);

// //     // Auto focus to next input after filling current one
// //     if (value !== '' && index < 5) {
// //       inputRefs.current[index + 1].focus();
// //     }
// //   };

// //   // Handle backspace key to move to previous input
// //   const handleKeyDown = (index, e) => {
// //     if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
// //       inputRefs.current[index - 1].focus();
// //     }
// //   };

// //   // Handle paste event
// //   const handlePaste = (e) => {
// //     e.preventDefault();
// //     const pastedData = e.clipboardData.getData('text/plain').trim();
// //     if (!/^\d+$/.test(pastedData)) return; // Only allow numbers
    
// //     const digits = pastedData.slice(0, 6).split('');
// //     const newOtpDigits = [...otpDigits];
    
// //     digits.forEach((digit, idx) => {
// //       if (idx < 6) {
// //         newOtpDigits[idx] = digit;
// //       }
// //     });
    
// //     setOtpDigits(newOtpDigits);
    
// //     // Focus the next empty input or the last one if all filled
// //     const nextEmptyIndex = newOtpDigits.findIndex(d => d === '');
// //     if (nextEmptyIndex !== -1) {
// //       inputRefs.current[nextEmptyIndex].focus();
// //     } else if (digits.length > 0) {
// //       inputRefs.current[5].focus();
// //     }
// //   };

// //   // Timer countdown effect
// //   useEffect(() => {
// //     let interval = null;
    
// //     if (isTimerActive && timer > 0) {
// //       interval = setInterval(() => {
// //         setTimer(timer => timer - 1);
// //       }, 1000);
// //     } else if (timer === 0) {
// //       setIsTimerActive(false);
// //     }
    
// //     return () => {
// //       if (interval) clearInterval(interval);
// //     };
// //   }, [isTimerActive, timer]);

// //   // Format time remaining
// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
// //   };

// //   // Check if email has been verified
// //   const checkEmailVerification = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
      
// //       // Reload user to check verification status
// //       await currentUser.reload();
      
// //       if (currentUser.emailVerified) {
// //         setEmailChecked(true);
// //         setSuccess('Email verified successfully! Redirecting...');
        
// //         // Proceed to home page
// //         setTimeout(() => {
// //           setNeedsMultiFactor(false);
// //           navigate('/home');
// //         }, 2000);
// //       } else {
// //         setError('Email not verified yet. Please check your inbox and click the verification link.');
// //       }
      
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to check verification status: ' + (err.message || 'Please try again.'));
// //       setLoading(false);
// //     }
// //   };

// //   // Handle resend verification
// //   const handleResend = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       setSuccess('');
      
// //       // Reset timer
// //       setTimer(60);
// //       setIsTimerActive(true);
      
// //       if (verificationMethod === 'email') {
// //         await sendVerificationEmail();
// //         setEmailSent(true);
// //         setSuccess('Verification email has been sent again. Please check your inbox.');
// //       } else {
// //         // Reset OTP fields
// //         setOtpDigits(['', '', '', '', '', '']);
// //         // Focus first input
// //         inputRefs.current[0].focus();
        
// //         await setupPhoneVerification();
// //         setSuccess('Verification code resent to your phone.');
// //       }
      
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to resend verification: ' + (err.message || 'Please try again.'));
// //       setLoading(false);
// //     }
// //   };

// //   // Handle verification method switch
// //   const handleSwitchMethod = async () => {
// //     try {
// //       setLoading(true);
// //       setError('');
// //       setSuccess('');
      
// //       const newMethod = verificationMethod === 'email' ? 'phone' : 'email';
      
// //       // If switching to phone and we don't have a phone number
// //       if (newMethod === 'phone' && !userPhoneNumber) {
// //         const phone = prompt('Please enter your phone number (with country code, e.g., +1XXXXXXXXXX):');
        
// //         if (!phone) {
// //           throw new Error('Phone number is required');
// //         }
        
// //         if (!phone.startsWith('+')) {
// //           throw new Error('Phone number must include country code (e.g., +1 for US)');
// //         }
        
// //         setUserPhoneNumber(phone);
// //       }
      
// //       // Reset timer
// //       setTimer(60);
// //       setIsTimerActive(true);
      
// //       if (newMethod === 'email') {
// //         await sendVerificationEmail();
// //         setEmailSent(true);
// //         setSuccess('Verification email has been sent. Please check your inbox.');
// //       } else {
// //         // Reset OTP fields
// //         setOtpDigits(['', '', '', '', '', '']);
        
// //         await setupPhoneVerification();
// //         setSuccess('Verification code sent to your phone.');
// //       }
      
// //       setVerificationMethod(newMethod);
// //       setLoading(false);
// //     } catch (err) {
// //       setError('Failed to switch verification method: ' + (err.message || 'Please try again.'));
// //       setLoading(false);
// //     }
// //   };

// //   // Handle phone OTP verification
// //   const handleVerifyPhone = async (e) => {
// //     e.preventDefault();
    
// //     try {
// //       setLoading(true);
// //       setError('');
      
// //       const otpCode = otpDigits.join('');
      
// //       if (otpCode.length !== 6) {
// //         throw new Error('Please enter all 6 digits');
// //       }
      
// //       const isVerified = await verifyPhoneOTP(otpCode);
      
// //       if (!isVerified) {
// //         throw new Error('Invalid verification code. Please try again.');
// //       }
      
// //       setSuccess('Phone verified successfully! Redirecting...');
      
// //       // Proceed to home page
// //       setTimeout(() => {
// //         setNeedsMultiFactor(false);
// //         navigate('/home');
// //       }, 2000);
      
// //     } catch (err) {
// //       setError(err.message || 'Verification failed. Please try again.');
// //       setLoading(false);
// //     }
// //   };

// //   // Get masked contact info for display
// //   const getMaskedContact = () => {
// //     if (verificationMethod === 'email') {
// //       if (!currentUser?.email) return '';
      
// //       const [username, domain] = currentUser.email.split('@');
// //       const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
// //       return maskedUsername + '@' + domain;
// //     } else {
// //       if (!userPhoneNumber) return '';
      
// //       // Mask the middle part of the phone number
// //       return userPhoneNumber.slice(0, 4) + '***' + userPhoneNumber.slice(-4);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
// //         {/* Logo and title */}
// //         <div className="text-center mb-8">
// //           <h2 className="text-3xl font-bold text-indigo-600">Sentinent Stories</h2>
// //           <h1 className="mt-4 text-2xl font-semibold text-gray-900">Verification Required</h1>
// //           <p className="mt-2 text-gray-600">
// //             {verificationMethod === 'email' 
// //               ? 'We\'ve sent a verification email to your inbox' 
// //               : 'We\'ve sent a verification code to your phone'}
// //           </p>
// //         </div>

// //         {/* Error message */}
// //         {error && (
// //           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
// //             <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
// //             <span>{error}</span>
// //           </div>
// //         )}

// //         {/* Success message */}
// //         {success && (
// //           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
// //             {success}
// //           </div>
// //         )}

// //         {/* Contact info display */}
// //         <div className="flex items-center justify-center mb-6 text-gray-600">
// //           {verificationMethod === 'email' ? (
// //             <>
// //               <Mail className="h-5 w-5 mr-2 text-indigo-500" />
// //               <span>{getMaskedContact()}</span>
// //             </>
// //           ) : (
// //             <>
// //               <Phone className="h-5 w-5 mr-2 text-indigo-500" />
// //               <span>{getMaskedContact()}</span>
// //             </>
// //           )}
// //         </div>

// //         {/* Email verification UI */}
// //         {verificationMethod === 'email' && (
// //           <div className="text-center mb-8">
// //             {emailChecked ? (
// //               <div className="flex items-center justify-center text-green-500">
// //                 <Check className="h-8 w-8 mr-2" />
// //                 <span className="text-lg font-medium">Email verified successfully!</span>
// //               </div>
// //             ) : (
// //               <>
// //                 <p className="mb-4">Please check your email and click the verification link.</p>
// //                 <button
// //                   type="button"
// //                   onClick={checkEmailVerification}
// //                   disabled={loading || !emailSent}
// //                   className="mb-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
// //                 >
// //                   {loading ? 'Checking...' : 'I\'ve verified my email'}
// //                 </button>
// //               </>
// //             )}
// //           </div>
// //         )}

// //         {/* Phone verification UI */}
// //         {verificationMethod === 'phone' && (
// //           <form onSubmit={handleVerifyPhone}>
// //             {/* OTP Input Fields */}
// //             <div className="flex justify-center space-x-2 sm:space-x-4 mb-8" onPaste={handlePaste}>
// //               {otpDigits.map((digit, index) => (
// //                 <input
// //                   key={index}
// //                   ref={el => inputRefs.current[index] = el}
// //                   type="text"
// //                   value={digit}
// //                   maxLength="1"
// //                   onChange={(e) => handleDigitChange(index, e.target.value)}
// //                   onKeyDown={(e) => handleKeyDown(index, e)}
// //                   className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
// //                   autoFocus={index === 0}
// //                   disabled={loading}
// //                 />
// //               ))}
// //             </div>

// //             {/* Verify button */}
// //             <button
// //               type="submit"
// //               disabled={loading || otpDigits.some(digit => digit === '')}
// //               className="mb-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-70"
// //             >
// //               {loading ? 'Verifying...' : 'Verify Code'}
// //             </button>
// //           </form>
// //         )}

// //         {/* Timer and Resend */}
// //         <div className="text-center mb-6">
// //           {isTimerActive ? (
// //             <p className="text-gray-600">
// //               Resend {verificationMethod === 'email' ? 'email' : 'code'} in <span className="font-semibold">{formatTime(timer)}</span>
// //             </p>
// //           ) : (
// //             <button
// //               type="button"
// //               onClick={handleResend}
// //               disabled={loading}
// //               className="flex items-center justify-center mx-auto text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
// //             >
// //               <RefreshCw className="h-4 w-4 mr-1" />
// //               Resend {verificationMethod === 'email' ? 'Email' : 'Code'}
// //             </button>
// //           )}
// //         </div>

// //         {/* Verification Method Toggle */}
// //         <div className="text-center mb-6">
// //           <button
// //             type="button"
// //             onClick={handleSwitchMethod}
// //             disabled={loading}
// //             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
// //           >
// //             Verify with {verificationMethod === 'email' ? 'phone' : 'email'} instead
// //           </button>
// //         </div>

// //         {/* Hidden recaptcha container needed for phone auth */}
// //         <div id="recaptcha-container"></div>

// //         {/* Back Link */}
// //         <div className="text-center">
// //           <a 
// //             href="/"
// //             className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600"
// //           >
// //             <ArrowLeft className="h-4 w-4 mr-1" />
// //             Back to login
// //           </a>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MultiFacPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { ArrowLeft, Mail, Phone, AlertCircle, RefreshCw, Check } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const MultiFacPage = () => {
//   const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
//   const [timer, setTimer] = useState(60);
//   const [isTimerActive, setIsTimerActive] = useState(true);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [emailSent, setEmailSent] = useState(false);
//   const [emailChecked, setEmailChecked] = useState(false);
  
//   const inputRefs = useRef([]);
//   const navigate = useNavigate();
//   const { 
//     currentUser, 
//     setNeedsMultiFactor, 
//     verificationMethod,
//     setVerificationMethod,
//     sendVerificationEmail,
//     setupPhoneVerification,
//     verifyPhoneOTP,
//     userPhoneNumber,
//     setUserPhoneNumber
//   } = useAuth();

//   // Send verification when component mounts
//   useEffect(() => {
//     const initiateVerification = async () => {
//       if (!currentUser) {
//         navigate('/');
//         return;
//       }
      
//       try {
//         setLoading(true);
        
//         if (verificationMethod === 'email') {
//           await sendVerificationEmail();
//           setEmailSent(true);
//           setSuccess('Verification email has been sent. Please check your inbox.');
//         } else {
//           await setupPhoneVerification();
//           setSuccess('Verification code sent to your phone.');
//         }
        
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to send verification: ' + (err.message || 'Please try again.'));
//         setLoading(false);
//       }
//     };
    
//     initiateVerification();
//   }, [currentUser, navigate, sendVerificationEmail, setupPhoneVerification, verificationMethod]);

//   // Handle digit input for phone verification
//   const handleDigitChange = (index, value) => {
//     // Only allow single digits
//     if (value.length > 1) {
//       value = value.slice(0, 1);
//     }
    
//     // Only allow numbers
//     if (!/^\d*$/.test(value) && value !== '') {
//       return;
//     }

//     const newOtpDigits = [...otpDigits];
//     newOtpDigits[index] = value;
//     setOtpDigits(newOtpDigits);

//     // Auto focus to next input after filling current one
//     if (value !== '' && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   // Handle backspace key to move to previous input
//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Handle paste event
//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text/plain').trim();
//     if (!/^\d+$/.test(pastedData)) return; // Only allow numbers
    
//     const digits = pastedData.slice(0, 6).split('');
//     const newOtpDigits = [...otpDigits];
    
//     digits.forEach((digit, idx) => {
//       if (idx < 6) {
//         newOtpDigits[idx] = digit;
//       }
//     });
    
//     setOtpDigits(newOtpDigits);
    
//     // Focus the next empty input or the last one if all filled
//     const nextEmptyIndex = newOtpDigits.findIndex(d => d === '');
//     if (nextEmptyIndex !== -1) {
//       inputRefs.current[nextEmptyIndex].focus();
//     } else if (digits.length > 0) {
//       inputRefs.current[5].focus();
//     }
//   };

//   // Timer countdown effect
//   useEffect(() => {
//     let interval = null;
    
//     if (isTimerActive && timer > 0) {
//       interval = setInterval(() => {
//         setTimer(timer => timer - 1);
//       }, 1000);
//     } else if (timer === 0) {
//       setIsTimerActive(false);
//     }
    
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isTimerActive, timer]);

//   // Format time remaining
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   // Check if email has been verified
//   const checkEmailVerification = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       // Reload user to check verification status
//       await currentUser.reload();
      
//       if (currentUser.emailVerified) {
//         setEmailChecked(true);
//         setSuccess('Email verified successfully! Redirecting...');
        
//         // Proceed to home page
//         setTimeout(() => {
//           setNeedsMultiFactor(false);
//           navigate('/home');
//         }, 2000);
//       } else {
//         setError('Email not verified yet. Please check your inbox and click the verification link.');
//       }
      
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to check verification status: ' + (err.message || 'Please try again.'));
//       setLoading(false);
//     }
//   };

//   // Handle resend verification
//   const handleResend = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setSuccess('');
      
//       // Reset timer
//       setTimer(60);
//       setIsTimerActive(true);
      
//       if (verificationMethod === 'email') {
//         await sendVerificationEmail();
//         setEmailSent(true);
//         setSuccess('Verification email has been sent again. Please check your inbox.');
//       } else {
//         // Reset OTP fields
//         setOtpDigits(['', '', '', '', '', '']);
//         // Focus first input
//         inputRefs.current[0].focus();
        
//         await setupPhoneVerification();
//         setSuccess('Verification code resent to your phone.');
//       }
      
//       setLoading(false);
//     } catch (err) {
//       setError('Failed to resend verification: ' + (err.message || 'Please try again.'));
//       setLoading(false);
//     }
//   };

//   // Handle verification method switch
//   const handleSwitchMethod = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       setSuccess('');
      
//       const newMethod = verificationMethod === 'email' ? 'phone' : 'email';
      
//       // If switching to phone and we don't have a phone number
//       if (newMethod === 'phone' && !userPhoneNumber) {
//         const phone = prompt('Please enter your phone number (with country code, e.g., +1XXXXXXXXXX):');
        
//         if (!phone) {
//           setLoading(false);
//           return; // User cancelled, don't switch methods
//         }
        
//         if (!phone.startsWith('+')) {
//           throw new Error('Phone number must include country code (e.g., +1 for US)');
//         }
        
//         setUserPhoneNumber(phone);
//       }
      
//       // Reset timer
//       setTimer(60);
//       setIsTimerActive(true);
      
//       // Switch method first, so the UI updates
//       setVerificationMethod(newMethod);
      
//       if (newMethod === 'email') {
//         await sendVerificationEmail();
//         setEmailSent(true);
//         setSuccess('Verification email has been sent. Please check your inbox.');
//       } else {
//         // Reset OTP fields
//         setOtpDigits(['', '', '', '', '', '']);
        
//         await setupPhoneVerification();
//         setSuccess('Verification code sent to your phone.');
//       }
      
//       setLoading(false);
//     } catch (err) {
//       // Switch back to previous method if there's an error
//       setVerificationMethod(verificationMethod === 'email' ? 'email' : 'phone');
//       setError('Failed to switch verification method: ' + (err.message || 'Please try again.'));
//       setLoading(false);
//     }
//   };

//   // Handle phone OTP verification
//   const handleVerifyPhone = async (e) => {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
//       setError('');
      
//       const otpCode = otpDigits.join('');
      
//       if (otpCode.length !== 6) {
//         throw new Error('Please enter all 6 digits');
//       }
      
//       const isVerified = await verifyPhoneOTP(otpCode);
      
//       if (!isVerified) {
//         throw new Error('Invalid verification code. Please try again.');
//       }
      
//       setSuccess('Phone verified successfully! Redirecting...');
      
//       // Proceed to home page
//       setTimeout(() => {
//         setNeedsMultiFactor(false);
//         navigate('/home');
//       }, 2000);
      
//     } catch (err) {
//       setError(err.message || 'Verification failed. Please try again.');
//       setLoading(false);
//     }
//   };

//   // Get masked contact info for display
//   const getMaskedContact = () => {
//     if (verificationMethod === 'email') {
//       if (!currentUser?.email) return '';
      
//       const [username, domain] = currentUser.email.split('@');
//       const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
//       return maskedUsername + '@' + domain;
//     } else {
//       if (!userPhoneNumber) return '';
      
//       // Mask the middle part of the phone number
//       return userPhoneNumber.slice(0, 4) + '***' + userPhoneNumber.slice(-4);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
//         {/* Logo and title */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-indigo-600">Sentinent Stories</h2>
//           <h1 className="mt-4 text-2xl font-semibold text-gray-900">Verification Required</h1>
//           <p className="mt-2 text-gray-600">
//             {verificationMethod === 'email' 
//               ? 'We\'ve sent a verification email to your inbox' 
//               : 'We\'ve sent a verification code to your phone'}
//           </p>
//         </div>

//         {/* Error message */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
//             <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}

//         {/* Success message */}
//         {success && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
//             {success}
//           </div>
//         )}

//         {/* Contact info display */}
//         <div className="flex items-center justify-center mb-6 text-gray-600">
//           {verificationMethod === 'email' ? (
//             <>
//               <Mail className="h-5 w-5 mr-2 text-indigo-500" />
//               <span>{getMaskedContact()}</span>
//             </>
//           ) : (
//             <>
//               <Phone className="h-5 w-5 mr-2 text-indigo-500" />
//               <span>{getMaskedContact()}</span>
//             </>
//           )}
//         </div>

//         {/* Email verification UI */}
//         {verificationMethod === 'email' && (
//           <div className="text-center mb-8">
//             {emailChecked ? (
//               <div className="flex items-center justify-center text-green-500">
//                 <Check className="h-8 w-8 mr-2" />
//                 <span className="text-lg font-medium">Email verified successfully!</span>
//               </div>
//             ) : (
//               <>
//                 <p className="mb-4">Please check your email and click the verification link.</p>
//                 <button
//                   type="button"
//                   onClick={checkEmailVerification}
//                   disabled={loading || !emailSent}
//                   className="mb-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
//                 >
//                   {loading ? 'Checking...' : 'I\'ve verified my email'}
//                 </button>
//               </>
//             )}
//           </div>
//         )}

//         {/* Phone verification UI */}
//         {verificationMethod === 'phone' && (
//           <form onSubmit={handleVerifyPhone}>
//             {/* OTP Input Fields */}
//             <div className="flex justify-center space-x-2 sm:space-x-4 mb-8" onPaste={handlePaste}>
//               {otpDigits.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={el => inputRefs.current[index] = el}
//                   type="text"
//                   value={digit}
//                   maxLength="1"
//                   onChange={(e) => handleDigitChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                   autoFocus={index === 0}
//                   disabled={loading}
//                 />
//               ))}
//             </div>

//             {/* Verify button */}
//             <button
//               type="submit"
//               disabled={loading || otpDigits.some(digit => digit === '')}
//               className="mb-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-70"
//             >
//               {loading ? 'Verifying...' : 'Verify Code'}
//             </button>
//           </form>
//         )}

//         {/* Timer and Resend */}
//         <div className="text-center mb-6">
//           {isTimerActive ? (
//             <p className="text-gray-600">
//               Resend {verificationMethod === 'email' ? 'email' : 'code'} in <span className="font-semibold">{formatTime(timer)}</span>
//             </p>
//           ) : (
//             <button
//               type="button"
//               onClick={handleResend}
//               disabled={loading}
//               className="flex items-center justify-center mx-auto text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
//             >
//               <RefreshCw className="h-4 w-4 mr-1" />
//               Resend {verificationMethod === 'email' ? 'Email' : 'Code'}
//             </button>
//           )}
//         </div>

//         {/* Verification Method Toggle */}
//         <div className="text-center mb-6">
//           <button
//             type="button"
//             onClick={handleSwitchMethod}
//             disabled={loading}
//             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
//           >
//             Verify with {verificationMethod === 'email' ? 'phone' : 'email'} instead
//           </button>
//         </div>

//         {/* Hidden recaptcha container needed for phone auth */}
//         <div id="recaptcha-container" className="mb-4"></div>

//         {/* Back Link */}
//         <div className="text-center">
//           <a 
//             href="/"
//             className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600"
//           >
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             Back to login
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MultiFacPage;

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Phone, AlertCircle, RefreshCw, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MultiFacPage = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { 
    currentUser, 
    setNeedsMultiFactor, 
    verificationMethod,
    setVerificationMethod,
    sendVerificationEmail,
    setupPhoneVerification,
    verifyPhoneOTP,
    userPhoneNumber,
    setUserPhoneNumber
  } = useAuth();

  // Send verification when component mounts
  useEffect(() => {
    const initiateVerification = async () => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        
        if (verificationMethod === 'email') {
          await sendVerificationEmail();
          setEmailSent(true);
          setSuccess('Verification email has been sent. Please check your inbox.');
        } else {
          await setupPhoneVerification();
          setSuccess('Verification code sent to your phone.');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to send verification: ' + (err.message || 'Please try again.'));
        setLoading(false);
      }
    };
    
    initiateVerification();
  }, [currentUser, navigate, sendVerificationEmail, setupPhoneVerification, verificationMethod]);

  // Handle digit input for phone verification
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

  // Check if email has been verified
  const checkEmailVerification = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Reload user to check verification status
      await currentUser.reload();
      
      if (currentUser.emailVerified) {
        setEmailChecked(true);
        setSuccess('Email verified successfully! Redirecting...');
        
        // Proceed to home page
        setTimeout(() => {
          setNeedsMultiFactor(false);
          navigate('/home');
        }, 2000);
      } else {
        setError('Email not verified yet. Please check your inbox and click the verification link.');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to check verification status: ' + (err.message || 'Please try again.'));
      setLoading(false);
    }
  };

  // Handle resend verification
  const handleResend = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Reset timer
      setTimer(60);
      setIsTimerActive(true);
      
      if (verificationMethod === 'email') {
        await sendVerificationEmail();
        setEmailSent(true);
        setSuccess('Verification email has been sent again. Please check your inbox.');
      } else {
        // Reset OTP fields
        setOtpDigits(['', '', '', '', '', '']);
        // Focus first input
        inputRefs.current[0].focus();
        
        await setupPhoneVerification();
        setSuccess('Verification code resent to your phone.');
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to resend verification: ' + (err.message || 'Please try again.'));
      setLoading(false);
    }
  };

  // Handle verification method switch
  const handleSwitchMethod = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const newMethod = verificationMethod === 'email' ? 'phone' : 'email';
      
      // If switching to phone and we don't have a phone number
      if (newMethod === 'phone' && !userPhoneNumber) {
        const phone = prompt('Please enter your phone number (with country code, e.g., +1XXXXXXXXXX):');
        
        if (!phone) {
          setLoading(false);
          return; // User cancelled, don't switch methods
        }
        
        if (!phone.startsWith('+')) {
          throw new Error('Phone number must include country code (e.g., +1 for US)');
        }
        
        setUserPhoneNumber(phone);
      }
      
      // Reset timer
      setTimer(60);
      setIsTimerActive(true);
      
      // Switch method first, so the UI updates
      setVerificationMethod(newMethod);
      
      if (newMethod === 'email') {
        await sendVerificationEmail();
        setEmailSent(true);
        setSuccess('Verification email has been sent. Please check your inbox.');
      } else {
        // Reset OTP fields
        setOtpDigits(['', '', '', '', '', '']);
        
        await setupPhoneVerification();
        setSuccess('Verification code sent to your phone.');
      }
      
      setLoading(false);
    } catch (err) {
      // Switch back to previous method if there's an error
      setVerificationMethod(verificationMethod === 'email' ? 'email' : 'phone');
      setError('Failed to switch verification method: ' + (err.message || 'Please try again.'));
      setLoading(false);
    }
  };

  // Handle phone OTP verification
  const handleVerifyPhone = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const otpCode = otpDigits.join('');
      
      if (otpCode.length !== 6) {
        throw new Error('Please enter all 6 digits');
      }
      
      const isVerified = await verifyPhoneOTP(otpCode);
      
      if (!isVerified) {
        throw new Error('Invalid verification code. Please try again.');
      }
      
      setSuccess('Phone verified successfully! Redirecting...');
      
      // Proceed to home page
      setTimeout(() => {
        setNeedsMultiFactor(false);
        navigate('/home');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
      setLoading(false);
    }
  };

  // Get masked contact info for display
  const getMaskedContact = () => {
    if (verificationMethod === 'email') {
      if (!currentUser?.email) return '';
      
      const [username, domain] = currentUser.email.split('@');
      const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
      return maskedUsername + '@' + domain;
    } else {
      if (!userPhoneNumber) return '';
      
      // Mask the middle part of the phone number
      return userPhoneNumber.slice(0, 4) + '***' + userPhoneNumber.slice(-4);
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
            {verificationMethod === 'email' 
              ? 'We\'ve sent a verification email to your inbox' 
              : 'We\'ve sent a verification code to your phone'}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Contact info display */}
        <div className="flex items-center justify-center mb-6 text-gray-600">
          {verificationMethod === 'email' ? (
            <>
              <Mail className="h-5 w-5 mr-2 text-indigo-500" />
              <span>{getMaskedContact()}</span>
            </>
          ) : (
            <>
              <Phone className="h-5 w-5 mr-2 text-indigo-500" />
              <span>{getMaskedContact()}</span>
            </>
          )}
        </div>

        {/* Email verification UI */}
        {verificationMethod === 'email' && (
          <div className="text-center mb-8">
            {emailChecked ? (
              <div className="flex items-center justify-center text-green-500">
                <Check className="h-8 w-8 mr-2" />
                <span className="text-lg font-medium">Email verified successfully!</span>
              </div>
            ) : (
              <>
                <p className="mb-4">Please check your email and click the verification link.</p>
                <button
                  type="button"
                  onClick={checkEmailVerification}
                  disabled={loading || !emailSent}
                  className="mb-4 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'I\'ve verified my email'}
                </button>
              </>
            )}
          </div>
        )}

        {/* Phone verification UI */}
        {verificationMethod === 'phone' && (
          <form onSubmit={handleVerifyPhone}>
            {/* Development mode notice */}
            <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
              <p className="text-sm font-medium">Development Mode:</p>
              <p className="text-sm">For testing purposes, enter any 6 digits to verify.</p>
            </div>

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
                  disabled={loading}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              type="submit"
              disabled={loading || otpDigits.some(digit => digit === '')}
              className="mb-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}

        {/* Timer and Resend */}
        <div className="text-center mb-6">
          {isTimerActive ? (
            <p className="text-gray-600">
              Resend {verificationMethod === 'email' ? 'email' : 'code'} in <span className="font-semibold">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="flex items-center justify-center mx-auto text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Resend {verificationMethod === 'email' ? 'Email' : 'Code'}
            </button>
          )}
        </div>

        {/* Verification Method Toggle */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={handleSwitchMethod}
            disabled={loading}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Verify with {verificationMethod === 'email' ? 'phone' : 'email'} instead
          </button>
        </div>

        {/* Hidden recaptcha container (not needed for development mode) */}
        <div id="recaptcha-container" className="mb-4"></div>

        {/* Back Link */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default MultiFacPage;