import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import PokemonDetails from "./pages/PokemonDetails";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import PrivateRoute from "./components/PrivateRoute";
import TeamDetail from "./pages/TeamDetail";
import Teams from "./pages/Teams";
import TeamEdit from "./pages/TeamEdit";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark").matches) {
      setDarkMode(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div
          className={`min-h-screen ${
            darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-132px)]">
            <Routes>
              <Route path="/" element={<HomePage darkMode={darkMode} />} />
              <Route
                path="/pokemon/:id"
                element={<PokemonDetails darkMode={darkMode} />}
              />
              <Route path="/login" element={<Login darkMode={darkMode} />} />
              <Route
                path="/register"
                element={<Register darkMode={darkMode} />}
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile darkMode={darkMode} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PrivateRoute>
                    <Favorites darkMode={darkMode} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/teams"
                element={
                  <PrivateRoute>
                    <Teams darkMode={darkMode} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/teams/:id"
                element={
                  <PrivateRoute>
                    <TeamDetail darkMode={darkMode} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/teams/:id/edit"
                element={
                  <PrivateRoute>
                    <TeamEdit darkMode={darkMode} />
                  </PrivateRoute>
                }
              />

              <Route
                path="/forgot-password"
                element={<ForgotPassword darkMode={darkMode} />}
              />
              <Route
                path="/reset-password"
                element={<ResetPassword darkMode={darkMode} />}
              />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
