import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ 
  cartCount, 
  showSearchBar, 
  searchQuery, 
  setSearchQuery, 
  user, 
  onLogout 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to login if user is not logged in and the path is '/cart'
    if (location.pathname === '/cart' && !user) {
      navigate('/login');
    }
  }, [location.pathname, user, navigate]);

  const handleHomeClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (user) {
      navigate('/restaurants'); // Navigate to restaurants if user is logged in
    } else {
      navigate('/'); // Navigate to home if no user is logged in
    }
  };

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
          <li>
            <a href="/" onClick={handleHomeClick}>
              Home
            </a>
          </li>
          {location.pathname !== '/about' && (
            <li><Link to="/about">About</Link></li>
          )}
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
              
              <li>
                <Link to="/user/orders">
                  My Orders
                </Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li>Hyderabad</li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
