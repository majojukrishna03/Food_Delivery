import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './Register.css';

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
  const [adminCount, setAdminCount] = useState(0);
  const navigate = useNavigate();

  // Fetch admin count when component mounts
  useEffect(() => {
    const fetchAdminCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/admin/count');
        setAdminCount(response.data.count || 0);
      } catch (err) {
        console.error('Error fetching admin count:', err.response?.data || err.message);
      }
    };
    fetchAdminCount();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
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
      alert('Registration successful! Please log in.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during registration.');
      setMessage('');
    }
  };

  return (
    <>
    <Header />
      <div className="register-container">
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
          {adminCount < 1 && (
            <input
              type="text"
              name="role"
              placeholder="Role (Optional)"
              value={formData.role}
              onChange={handleChange}
            />
          )}
          <input
            type="text"
            name="phone"
            placeholder="Phone (Optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
          type='text'
            name="address"
            placeholder="Address (Optional)"
            value={formData.address}
            onChange={handleChange}
          />
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
