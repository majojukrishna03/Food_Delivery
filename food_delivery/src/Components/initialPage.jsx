// src/components/InitialPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './initialPage.css';

const InitialPage = () => {
  return (
    <>
      <Header />
      <div className="home-container">
        <main className="hero">
          <div className="hero-content">
            <h2>Welcome to Inti Bhojanam</h2>
            <p>Discover the taste of homemade meals:</p>
            <div className="cta-buttons">
              <Link to="/user" className="cta-button">User Portal</Link>
              <Link to="/admin" className="cta-button">Admin Portal</Link>
            </div>
          </div>
        </main>
      </div>
      <Footer/>
    </>
  );
};

export default InitialPage;
