import React from 'react'
import websiteLogo from "../assets/website_logo.svg"

const Navbar = () => {
  return (
    <div>
      <img className="w-10 h-10" src={websiteLogo} alt="Webiste Logo"/> 
      <p>PokeSearch</p>
    </div>
  )
}

export default Navbar;
