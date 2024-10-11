import React from 'react';
import './Header.css';

const Header = ({cartCount,showSearchBar,searchQuery, setSearchQuery}) => {

  return (
    <header className="Header">
      <img src="/Inti Bhojanam.png" alt="Inti Bhojanam Logo"/>
      <h2>Inti Bhojanam</h2>
      {showSearchBar && (
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Handle input change
          className="search-bar" // Optional: add a class for styling
        />
      )}
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/cart">Cart {cartCount > 0 ? `(${cartCount})` : ''}</a></li>
          <li>Hyderabad</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
