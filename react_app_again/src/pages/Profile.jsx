import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api, { passwordApi } from '../hooks/api';

const Profile = ({ darkMode }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const [resetToken, setResetToken] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resetStep, setResetStep] = useState('request'); 
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await api.put('/api/users/me', { email });
      setSuccess('The profile has been updated');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data || 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    
    if (resetStep === 'reset') {
      if (newPassword !== confirmNewPassword) {
        setPasswordError('The new passwords are not identical');
        return;
      }
      
      if (newPassword.length < 8) {
        setPasswordError('The new password must contain at least 8 characters');
        return;
      }
    }
    
    setPasswordError('');
    setPasswordSuccess('');
    setIsLoading(true);
    
    try {
      if (resetStep === 'request') {
        const response = await passwordApi.requestReset(user.email);
        console.log('Reset requested:', response);
        setPasswordSuccess('Verification code has been sent to your email address.');
        setResetStep('verify');
      } 
      else if (resetStep === 'verify') {
        const response = await passwordApi.verifyCode(resetToken, verificationCode);
        console.log('Code verified:', response);
        if (response.data.valid) {
          setPasswordSuccess('Code verified successfully. Set your new password.');
          setResetStep('reset');
        } else {
          throw new Error('Invalid verification code');
        }
      } 
      else if (resetStep === 'reset') {
        const response = await passwordApi.resetPassword(resetToken, verificationCode, newPassword);
        console.log('Password reset:', response);
        setPasswordSuccess('Password has been changed successfully');
        
        setResetStep('request');
        setResetToken('');
        setVerificationCode('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsChangingPassword(false);
      }
    } catch (err) {
      console.error('Password change error:', err);
      const errorMsg = err.response?.data?.error || err.message || 'An error occurred while changing the password';
      setPasswordError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setPasswordError('');
    setIsLoading(true);
    
    try {
      await passwordApi.requestReset(user.email);
      setPasswordSuccess('A new verification code has been sent to your email address.');
    } catch (err) {
      console.error('Resend code error:', err);
      const errorMsg = err.response?.data?.error || 'An error occurred while sending the code';
      setPasswordError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPasswordChange = () => {
    setIsChangingPassword(false);
    setResetStep('request');
    setResetToken('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    setCurrentPassword('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        My Profile
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
          {success}
        </div>
      )}
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Account information
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                type="text"
                value={user?.username || ''}
                disabled
                className={`w-full px-3 py-2 rounded ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} opacity-75`}
              />
              <p className="mt-1 text-sm text-gray-500">
                Username cannot be changed
              </p>
            </div>
            
            <div className="mb-6">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded font-medium ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Username
              </span>
              <span className={`block text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.username || 'N/A'}
              </span>
            </div>
            
            <div className="mb-4">
              <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Email
              </span>
              <span className={`block text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.email || 'N/A'}
              </span>
            </div>
            
            <div className="mb-4">
              <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Date of joining
              </span>
              <span className={`block text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString() 
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md mb-6 mt-6`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Security
          </h3>
          <button
            onClick={() => {
              if (isChangingPassword) {
                cancelPasswordChange();
              } else {
                setIsChangingPassword(true);
              }
            }}
            className={`px-4 py-2 rounded ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isChangingPassword ? 'Cancel' : 'Change password'}
          </button>
        </div>
        
        {isChangingPassword ? (
          <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
            {passwordError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
                {passwordSuccess}
              </div>
            )}
            
            {resetStep === 'request' && (
              <div className="mb-6">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  To change your password, we'll send a verification code to your email address: <strong>{user?.email}</strong>
                </p>
                
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isLoading || !user?.email}
                  className={`w-full py-2 px-4 rounded font-medium ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } ${(isLoading || !user?.email) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Send verification code'}
                </button>
              </div>
            )}
            
            {resetStep === 'verify' && (
              <div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  Enter the token and verification code you received via email.
                </p>
                
                <div className="mb-4">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Token (found in your email)
                  </label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className={`w-full px-3 py-2 rounded ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                    } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Verification code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className={`w-full px-3 py-2 rounded ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                    } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    placeholder="e.g. 123456"
                    required
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isLoading || !resetToken || !verificationCode}
                    className={`flex-1 py-2 px-4 rounded font-medium ${
                      darkMode 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    } ${isLoading || !resetToken || !verificationCode ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify code'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading}
                    className={`py-2 px-4 rounded font-medium ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}
            
            {resetStep === 'reset' && (
              <div>
                <div className="mb-4">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                    } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    minLength={8}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded ${
                      darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                    } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isLoading || !newPassword || !confirmNewPassword}
                  className={`w-full py-2 px-4 rounded font-medium ${
                    darkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } ${isLoading || !newPassword || !confirmNewPassword ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Changing password...' : 'Change password'}
                </button>
              </div>
            )}
          </form>
        ) : (
          <div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last password change: {user?.lastPasswordChangeDate 
                ? new Date(user.lastPasswordChangeDate).toLocaleDateString() 
                : 'No information available'}
            </p>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Changing your password regularly increases the security of your account.
            </p>
          </div>
        )}
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Actions
        </h3>
        
        <button
          onClick={logout}
          className={`w-full py-2 px-4 rounded font-medium bg-red-500 hover:bg-red-600 text-white`}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;