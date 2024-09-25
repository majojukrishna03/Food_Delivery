import React from 'react'
import './Header.css'

function Header() {
  return (
    <header class="Header">
      <img src="Inti Bhojanam.png" alt="Inti Bhojanam Logo" />
      <h2>Inti Bhojanam</h2>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/cart">Cart</a></li>
        </ul>
      </nav>
  </header>

  )
}

export default Header
