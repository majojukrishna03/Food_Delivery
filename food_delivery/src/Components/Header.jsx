import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ 
  cartCount, 
  showSearchBar, 
  searchQuery, 
  setSearchQuery, 
  user, 
  onLogout 
}) => {
  return (
    <header className="Header">
      <div className="logo">
        <img src="/Inti Bhojanam.png" alt="Inti Bhojanam Logo" />
        <h2>Inti Bhojanam</h2>
      </div>
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
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li>
            <Link to="/cart">
              Cart {cartCount > 0 && <span>({cartCount})</span>}
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/" onClick={onLogout}>
                  Logout
                </Link>
                </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          <li>Hyderabad</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
