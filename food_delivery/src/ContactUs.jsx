import React, { useState } from 'react';
import './ContactUs.css'; 
import Footer from './Components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., sending to an API)
    alert('Message sent successfully!');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
    <header className='Header'>
        <img src='Inti Bhojanam.png' alt='Logo'></img>
        <h2>Inti Bhojanam</h2>
        <nav>
          <ul>
            {/* <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li> */}
            <li><a href='/'>Home</a></li>
            <li>Hyderabad</li>
          </ul>
        </nav>
      </header>
    <div className="contact-us-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Send Message</button>
      </form>

      <div className="contact-info">
        <h3>Or reach us at:</h3>
        <p>Email: support@intibhojanam.com</p>
        <p>Phone: +91 12345 67890</p>
        <p>Address: 11-2, Namalgundu, Hyderabad, Telangana, India</p>
      </div>

      <div className="social-media">
        <h3>Follow Us</h3>
        <a href="https://www.facebook.com/IntiBhojanam123" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com/IntiBhojanam123" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://www.instagram.com/IntiBhojanam123" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ContactUs;
