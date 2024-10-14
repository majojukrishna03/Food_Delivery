import React from 'react';
import './PrivacyPolicy.css'; // Import your CSS file for styling
import Footer from './Components/Footer';

const PrivacyPolicy = () => {
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
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: 11-10-2024 </p>
      
      <h2>Introduction</h2>
      <p>
        Welcome to the Inti Bhojanam online delivery service. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>
          <strong>Personal Information:</strong> We may collect personal information that you provide directly to us, such as your name, email address, phone number, and shipping address when you create an account or place an order.
        </li>
        <li>
          <strong>Payment Information:</strong> Payment details (e.g., credit card number) are collected by our payment processor and are not stored on our servers.
        </li>
        <li>
          <strong>Usage Data:</strong> We may collect information about how you use our website, including your IP address, browser type, and operating system.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>
        We may use the information we collect for various purposes, including:
      </p>
      <ul>
        <li>To process your orders and manage your account.</li>
        <li>To communicate with you about your orders, account updates, and promotional offers.</li>
        <li>To improve our website and services.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>Data Sharing and Disclosure</h2>
      <p>
        We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following situations:
      </p>
      <ul>
        <li>With trusted third parties who assist us in operating our website or conducting our business.</li>
        <li>To comply with legal requirements or respond to legal requests.</li>
        <li>To protect our rights, privacy, safety, or property, and/or that of our affiliates, you, or others.</li>
      </ul>

      <h2>Security of Your Information</h2>
      <p>
        We take reasonable measures to help protect personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal information:
      </p>
      <ul>
        <li>The right to access and request a copy of your personal information.</li>
        <li>The right to request correction of your personal information.</li>
        <li>The right to request deletion of your personal information.</li>
        <li>The right to withdraw consent where we rely on your consent to process your personal information.</li>
      </ul>

      <h2>Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please contact us at: <strong>support@intibhojanam.com</strong>.
      </p>
    </div>
    <Footer/>
    </>
  );
};

export default PrivacyPolicy;
