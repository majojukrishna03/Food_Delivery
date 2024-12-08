// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();  // useNavigate hook for redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine login endpoint based on role
      const isAdminLogin = window.location.pathname.includes('/admin/login');
      const loginEndpoint = isAdminLogin 
        ? 'http://localhost:5000/api/users/auth/admin/login' 
        : 'http://localhost:5000/api/users/auth/login';
  
      const response = await axios.post(loginEndpoint, formData);
  
      // Assuming the response contains token and user details
      const { token, user } = response.data;
  
      setMessage('Login successful!');
      setError('');
      alert('Login Successful.')
  
      // Store token and user details (including role) in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user details
  
      navigate('/restaurants');
    } catch (err) {
      const isAdminLogin = window.location.pathname.includes('/admin/login');
      setError(err.response?.data?.message);
      setMessage('');
      alert(`${error}`);
    }
  };

  return (
    <>
    <Header />
    
    <div className="auth-container">
      
      <h2>Login</h2>
      {/* {message && <p className="success-message">{message}</p>} */}
      {/* {error && <p className="error-message">{error}</p>} */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="auth-button">Login</button>
      </form>
      <h4>New user? <a href='/register'>Register Now</a></h4>
    </div>
    <Footer />
    </>
  );
};

export default Login;
