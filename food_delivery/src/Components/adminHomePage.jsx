// src/components/AdminHome.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Reuse the CSS file for styling
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';

const AdminHome = () => {
  const [isAdminExists, setIsAdminExists] = useState(false);

  // Check if an admin already exists in the database
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/admin/count');
        if (response.data.count >= 1) {
          setIsAdminExists(true);
        } else {
          setIsAdminExists(false);
        }
      } catch (err) {
        console.error('Error occurred while checking admin role:', err);
      }
    };

    checkAdminRole();
  }, []);

  return (
    <div className="home-container">
      <Header />
      <main className="hero">
        <div className="hero-content">
          <h2>Welcome to the Admin Portal</h2>
          <p>Create courses, manage and review applications effectively!</p>
          <div className="cta-buttons">
            {!isAdminExists && (
              <Link to="/admin/register" className="cta-button">Register</Link>
            )}
            <Link to="/admin/login" className="cta-button">Login</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminHome;
