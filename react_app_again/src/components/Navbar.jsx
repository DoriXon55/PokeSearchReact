import React, { useState } from "react";
import { Link } from "react-router-dom";
import darkLogo from "../assets/website_logo.svg";
import lightLogo from "../assets/favicon.svg";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ darkMode, setDarkMode }) => {
  const {isAuthenticated, user, logout} = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } shadow-md relative z-30`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          {darkMode ? (
            <img src={lightLogo} alt="Pokeball" className="h-8 w-8 mr-2" />
          ) : (
            <img src={darkLogo} alt="Pokeball" className="h-8 w-8 mr-2" />
          )}

          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">
            PokeSearch
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className={`${
              darkMode
                ? "text-gray-300 hover:text-red-400"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={toggleDropdown} className={`flex items-center space-x-1 ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:test-gray-900"}`}>
                <span>{user?.username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {showDropdown && (
                <div className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                  <Link to="/profile" className={`block px-4 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`} onClick={() => setShowDropdown(false)}>
                    My Profile
                  </Link>
                  <Link to="/favorites" className={`block px-4 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`} onClick={() => setShowDropdown(false)}>
                    Favorites Pokemons
                  </Link>
                  <Link to="/teams" className={`block px-4 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`} onClick={() => setShowDropdown(false)}>
                    My Teams
                  </Link>

                  <button onClick={() => {logout(); setShowDropdown(false);}} className={`block w-full text-left px-4 py-2 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"}`}>
                    Log out
                  </button>
                </div>
              )} 
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link 
                to="/login"
                className={`px-3 py-1 rounded ${
                  darkMode 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Log In
              </Link>
              <Link 
                to="/register"
                className={`px-3 py-1 rounded ${
                  darkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Register
              </Link>
            </div>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full focus:outline-none focus:ring-2"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;