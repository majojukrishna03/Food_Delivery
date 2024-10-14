import React from 'react';
import './TermsOfService.css';
import Footer from './Components/Footer';

const TermsOfService = () => {
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
    <div className="terms-of-service-container">
      <h1>Terms of Service</h1>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Inti Bhojanam! By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <h2>2. Acceptance of Terms</h2>
      <p>
        By using our services, you affirm that you are at least 18 years old or have the consent of a parent or guardian to use this service.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        You may need to create an account to use some features of our service. You are responsible for maintaining the confidentiality of your account information.
      </p>

      <h2>4. Orders and Payments</h2>
      <p>
        All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order at any time.
      </p>

      <h2>5. Delivery Policy</h2>
      <p>
        We strive to deliver your orders promptly. Delivery times may vary based on location and availability.
      </p>

      <h2>6. Privacy Policy</h2>
      <p>
        Your privacy is important to us. Please refer to our <a href="/privacy-policy">Privacy Policy</a> for information on how we collect, use, and disclose personal information.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Inti Bhojanam shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We may revise these terms from time to time. Any changes will be posted on this page, and your continued use of the service signifies your acceptance of the updated terms.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about these Terms of Service, please contact us at <a href="mailto:support@intibhojanam.com">support@intibhojanam.com</a>.
      </p>
    </div>
    <Footer/>
    </>
  );
};

export default TermsOfService;
