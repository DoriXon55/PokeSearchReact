import Footer from './components/Footer'
import Navbar from './components/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import { useEffect, useState } from 'react'

function App() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if(window.matchMedia('(prefers-color-scheme: dark').matches) {
      setDarkMode(true);
    }
  }, []);


  return (
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </BrowserRouter>
  )
}

export default App
