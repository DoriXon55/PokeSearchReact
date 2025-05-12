import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';


const Register = ({darkMode}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if(password !== confirmPassword)
        {
            setError('Hasła nie są identyczne');
            return;
        }

        setIsLoading(true);

        try{
            const success = await register(username, email, password);
            if(success)
            {
                navigate('/login', {state: { message: 'Your account has been created. You can log in'}});
            } else {
                setError('An error occurred during registration');
            }
        } catch (err) {
            if(err.response && err.response.data)
            {
                setError(err.response.data);
            } else {
                setError('An error occurred during registration');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="max-w-md mx-auto mt-10">
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Register
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 rounded ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
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
            
            <div className="mb-4">
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 rounded ${
                  darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className={`block mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Registration...' : 'Register'}
            </button>
          </form>
          
          <p className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600">
              Log in
            </Link>
          </p>
        </div>
      );
    };
    
    export default Register;
