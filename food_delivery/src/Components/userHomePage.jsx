// frontend/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';
import Header from './Header';
import Footer from './Footer';

const UserHome = () => {
  return (
    <>
    <div className="home-container">
      <Header />
      <main className="hero">
        <div className="hero-content">
          <h2>Welcome to the Education Platform</h2>
          <p>Discover our online programs and apply now!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button">Register</Link>
            <Link to="/login" className="cta-button">Login</Link>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
    </>
  );
};

export default UserHome;
