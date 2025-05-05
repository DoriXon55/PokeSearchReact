import Footer from './components/Footer'
import Navbar from './components/navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import { useEffect, useState } from 'react'
import PokemonDetails from './pages/PokemonDetails'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if(window.matchMedia('(prefers-color-scheme: dark').matches) {
      setDarkMode(true);
    }
  }, []);


  return (
    <BrowserRouter>
      <AuthProvider> 
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-132px)]">
            <Routes>
              <Route path="/" element={<HomePage darkMode={darkMode} />} />
              <Route path="/pokemon/:id" element={<PokemonDetails darkMode={darkMode} />} />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
