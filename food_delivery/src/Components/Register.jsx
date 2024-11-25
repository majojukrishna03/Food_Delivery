// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
    address: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage('Registration successful! Please log in.');
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: '',
        address: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration.');
      setMessage('');
    }
  };

  return (
    <>
    <div className="auth-container">
      <Header/>
      <h2>Register</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <input
          type = "text"
          name='role'
          placeholder='role (Optional)'
          value={formData.role}
          onChange = {handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone (Optional)"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
        />
        <button type="submit" className="auth-button">Register</button>
      </form>
      <Footer/>
    </div>
    </>
  );
};

export default Register;
