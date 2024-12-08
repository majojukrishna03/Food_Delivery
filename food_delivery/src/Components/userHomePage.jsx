// frontend/src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './userHomePage.css';

const UserHome = () => {
  return (
    <>
    <Header />
    <div className="userhome-container">
      <main className="userhero">
        <div className="hero-content">
          <h2>Welcome to the Inti Bhojanam</h2>
          <p>Discover our delicious food and Order now!</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button">Register</Link>
            <Link to="/login" className="cta-button">Login</Link>
          </div>
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
};

export default UserHome;
