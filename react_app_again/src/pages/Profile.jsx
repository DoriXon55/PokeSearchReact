// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../hooks/api';

const Profile = ({ darkMode }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await api.put('/api/users/me', { email });
      setSuccess('Profil został zaktualizowany');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data || 'Wystąpił błąd podczas aktualizacji profilu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Mój profil
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
            Informacje o koncie
          </h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isEditing ? 'Anuluj' : 'Edytuj'}
          </button>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nazwa użytkownika
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
                Nazwa użytkownika nie może być zmieniona
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
              {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Nazwa użytkownika
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
                Data dołączenia
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
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          Działania
        </h3>
        
        <button
          onClick={logout}
          className={`w-full py-2 px-4 rounded font-medium bg-red-500 hover:bg-red-600 text-white`}
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default Profile;