import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { passwordApi } from '../hooks/api';

const ForgotPassword = ({darkMode}) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const retro = {
        mainBg: darkMode ? 'bg-[#0f2b3c]' : 'bg-[#a8d0e6]',
        cardBg: darkMode ? 'bg-[#1e3a52]' : 'bg-[#7fb2d9]',
        headerBg: darkMode ? 'bg-[#264a67]' : 'bg-[#5c9eca]',
        buttonBg: darkMode ? 'bg-[#3b6d94]' : 'bg-[#4c87b5]',
        buttonHover: darkMode ? 'hover:bg-[#4d7ea3]' : 'hover:bg-[#3d78a6]',
        textMain: darkMode ? 'text-white' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-200' : 'text-gray-800',
        border: darkMode ? 'border-[#264a67]' : 'border-[#5c9eca]',
      };

      const handleSubmit = async(e) => {
        e.preventDefault();
        if(!email) return;
        setIsSubmitting(true);
        setError('');

        try {
            const response = await passwordApi.requestReset(email);
            if(response.data && response.data.message)
            {
                setSubmitSuccess(true);
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An error occurred while sending the password reset request.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
      }

      const handleResendCode = async () => {
        if(!email) return;
        setIsSubmitting(true);
        setError('');
        try{
            await passwordApi.requestReset(email);
            setError('');

            const successMsg = document.getElementById('resend-success');
            if(successMsg){
                successMsg.classList.remove('opacity-0');
                setTimeout(() => {
                    successMsg.classList.add('opacity-0');
                }, 3000);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Could not resend code';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }

      };

  return (
    <div className='max-w-md mx-auto mt-10'>
        <div className={`rounded-lg border-2 ${retro.border} ${retro.cardBg} p-6`}>
            <div className={`${retro.headerBg} py-3 px-4 -mx-6 -mt-6 mb-6 border-b-2 ${retro.border}`}>
                <h2 className='text-2xl font-bold text-white'>
                    Reset Password
                </h2>
            </div>

            {error && (
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                    {error}
                </div>
            )}

            {!submitSuccess ? (
                <>
                    <p className={`mb-4 ${retro.textMain}`}>
                        Enter the email address associated with your account and we'll send you a password reset code.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label className={`block mb-2 ${retro.textSecondary}`}>
                                Email
                            </label>
                            <input type='email' value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 rounded border-2 ${darkMode ? 'bg-[#173142] border-[#264a67] text-white' : 'bg-[#d2e7f5] border-[#5c9eca] text-gray-800'}`}
                                required
                                />
                        </div>
                        <button type='submit' disabled={isSubmitting || !email}
                        className={`w-full py-2 px-4 rounded font-medium border-2 ${retro.buttonBg} ${retro.buttonHover} ${darkMode ? 'border-[#264a67]' : 'border-[#3d78a6]'} text-white ${(isSubmitting || !email) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Sending...' : 'Send verification code'}
                        </button>
                    </form>
                </>
            ) : (
                <div>
                    <div className='mb-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'>
                        We have sent a verification code to the email address you provided. Please check your email. 
                    </div>
                    <div className='mb-4'>
                        <Link to={`/reset-password?email=${encodeURIComponent(email)}`}
                        className={`block w-full py-2 px-4 rounded text-center font-medium border-2 ${retro.buttonHover} ${darkMode ? 'border-[#264a67]' : 'border-[#3d78a6]'} text-white`}>
                        Go to password reset
                        </Link>
                    </div>

                    <div className='flex flex-col items-center mt-6'>
                        <p className={`text-sm ${retro.textSecondary}`}>
                            Haven't received your code?
                        </p>
                        <button onClick={handleResendCode} disabled={isSubmitting}
                        className={`mt-2 text-sm underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {isSubmitting ? 'Sending...' : 'Send again'}
                        </button>
                        <span id='resend-success' className='text-xs text-green-500 mt-1 transition-opacity duration-300 opacity-0'>
                            The code has been resent!
                        </span>
                    </div>
                </div>
            )}
        </div>

        <p className={`mt-4 text-center ${retro.textSecondary}`}>
            <Link to="/login" className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                Return to the login page
            </Link>
        </p>
    </div>
  );
};

export default ForgotPassword;
