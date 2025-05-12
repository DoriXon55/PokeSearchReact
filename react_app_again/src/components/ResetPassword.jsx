import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { passwordApi } from '../hooks/api';

const ResetPassword = ({darkMode}) => {
    const navigate = useNavigate();
    const location = useLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const params = new URLSearchParams(location.search);
    const email = params.get('email') || '';
    const [token, setToken] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState('verify-code'); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
  
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

    useEffect(() => {
        const tokenFromUrl = params.get('token');
        if(tokenFromUrl){
            setToken(tokenFromUrl);
        }
    }, [params])

    const handleResendCode = async () => {
        if(!email){
            setError('An email address is required to send the code.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            await passwordApi.requestReset(email);

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

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if(!verificationCode || !token) {
            setError('Verification code and token are required');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const response = await passwordApi.verifyCode(token, verificationCode);
            if(response.data && response.data.valid){
                setStep('new-password');
                setError('');
            } else {
                setError('Invalid verification code');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Code verification failed';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if(!newPassword || !confirmPassword){
            setError('Please complete all fields');
            return;
        }
        if(newPassword !== confirmPassword){
            setError('The passwords are not identical');
            return;
        }
        if(newPassword.length < 8)
        {
            setError('Password must contain at least 8 characters');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const response = await passwordApi.resetPassword(token, verificationCode, newPassword);
            
            if (response.data && response.data.message) {
              setIsSuccess(true);
              setTimeout(() => {
                navigate('/login', { state: { message: 'Hasło zostało zmienione. Możesz się teraz zalogować.' } });
              }, 3000);
            }
          } catch (err) {
            const errorMessage = err.response?.data?.error || 'Nie udało się zresetować hasła';
            setError(errorMessage);
          } finally {
            setIsSubmitting(false);
          }
    };



    return (
        <div className="max-w-md mx-auto mt-10">
          <div className={`rounded-lg border-2 ${retro.border} ${retro.cardBg} p-6`}>
            <div className={`${retro.headerBg} py-3 px-4 -mx-6 -mt-6 mb-6 border-b-2 ${retro.border}`}>
              <h2 className="text-2xl font-bold text-white">
                {step === 'verify-code' ? 'Weryfikacja kodu' : 'Ustaw nowe hasło'}
              </h2>
            </div>
            
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                {error}
              </div>
            )}
            
            {isSuccess ? (
              <div className="p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <p>Password reset successfully! You will be redirected shortly...</p>
              </div>
            ) : step === 'verify-code' ? (
              <form onSubmit={handleVerifyCode}>
                <div className="mb-4">
                  <p className={`mb-4 ${retro.textSecondary}`}>
                    Enter the verification code you received in your email.
                  </p>
                  
                  <label className={`block mb-2 ${retro.textSecondary}`}>
                    Token (you can find it in the link in the email)
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className={`w-full px-3 py-2 rounded border-2 ${darkMode ? 'bg-[#173142] border-[#264a67] text-white' : 'bg-[#d2e7f5] border-[#5c9eca] text-gray-800'}`}
                    placeholder="np. 550e8400-e29b-41d4-a716-446655440000"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block mb-2 ${retro.textSecondary}`}>
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`w-full px-3 py-2 rounded border-2 ${darkMode ? 'bg-[#173142] border-[#264a67] text-white' : 'bg-[#d2e7f5] border-[#5c9eca] text-gray-800'}`}
                    placeholder="np. 123456"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !verificationCode || !token}
                  className={`w-full py-2 px-4 rounded font-medium border-2 ${retro.buttonBg} ${retro.buttonHover} ${darkMode ? 'border-[#264a67]' : 'border-[#3d78a6]'} text-white ${(isSubmitting || !verificationCode || !token) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Weryfikacja...' : 'Weryfikuj kod'}
                </button>
                
                <div className="flex flex-col items-center mt-6">
                  <p className={`text-sm ${retro.textSecondary}`}>
                  Haven't received a code or is it out of date?
                  </p>
                  <button 
                    onClick={handleResendCode}
                    disabled={isSubmitting || !email}
                    className={`mt-2 text-sm underline ${darkMode ? 'text-blue-400' : 'text-blue-600'} ${(isSubmitting || !email) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Wysyłanie...' : 'Wyślij ponownie'}
                  </button>
                  <span id="resend-success" className="text-xs text-green-500 mt-1 transition-opacity duration-300 opacity-0">
                  The code has been resent!
                  </span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className={`block mb-2 ${retro.textSecondary}`}>
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded border-2 ${darkMode ? 'bg-[#173142] border-[#264a67] text-white' : 'bg-[#d2e7f5] border-[#5c9eca] text-gray-800'}`}
                    placeholder="Minimum 8 znaków"
                    minLength={8}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block mb-2 ${retro.textSecondary}`}>
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded border-2 ${darkMode ? 'bg-[#173142] border-[#264a67] text-white' : 'bg-[#d2e7f5] border-[#5c9eca] text-gray-800'}`}
                    placeholder="Powtórz hasło"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !newPassword || !confirmPassword}
                  className={`w-full py-2 px-4 rounded font-medium border-2 ${retro.buttonBg} ${retro.buttonHover} ${darkMode ? 'border-[#264a67]' : 'border-[#3d78a6]'} text-white ${(isSubmitting || !newPassword || !confirmPassword) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Zmienianie hasła...' : 'Zmień hasło'}
                </button>
              </form>
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

export default ResetPassword;
