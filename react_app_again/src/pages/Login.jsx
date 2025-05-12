import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = ({ darkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      } else {
        setError("Nieprawidłowa nazwa użytkownika lub hasło");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas logowania");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2
        className={`text-2xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Log in
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className={`block mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full px-3 py-2 rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
            } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className={`block mb-2 ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 rounded ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
            } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded font-medium ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Login..." : "Log in"}
        </button>

        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className={`text-sm ${
              darkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Forgot your password?
          </Link>
        </div>
      </form>

      <p
        className={`mt-4 text-center ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
