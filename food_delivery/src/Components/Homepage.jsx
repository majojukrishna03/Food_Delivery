import React from 'react';
import './Homepage.css';
import './Header.css'
import Footer from './Footer';

const Homepage = () => {
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
      
      <section className='Content-background'>
        <section className='Content'>
          <h1>Welcome to Inti Bhojanam - Bringing homely Telugu flavors to your doorstep</h1>
          <p>Craving the comfort of homemade Telugu meals? Look no further! At IntiBhojanam, we deliver the rich and authentic flavors of Andhra and Telangana straight to your table. Whether it's spicy Pappu, aromatic Biryani, or the soulful taste of Gutti Vankaya, our partnered home-style restaurants serve dishes made with love, just like at home.</p>

          {/* Replace <p> with <div> to avoid invalid nesting */}
          <div>
            <p>Order now and experience:</p>
            <ul>
              <li>Authentic Telugu Delicacies: Discover the magic of traditional Telugu recipes passed down through generations, with every bite packed with authenticity.</li>
              <li>Fresh and Locally Sourced Ingredients: Our chefs believe in using only the freshest ingredients to ensure that each dish not only tastes good but is healthy and nutritious.</li>
              <li>A Taste of Home, Wherever You Are: Whether you're away from home or just yearning for some comfort food, we bring the warmth of a Telugu home-cooked meal right to your doorstep.</li>
              <li>Meals Cooked with Love and Care: Our home-style kitchens prepare each dish as if it were made for their own families, so you get that unmistakable homely touch with every meal.</li>
              <li>Delight for Every Occasion: From everyday meals to festive feasts, IntiBhojanam offers a wide variety of dishes to cater to your every craving.</li>
            </ul>
          </div>

          <p>No more missing out on the taste of home – Inti Bhojanam is here to satisfy your hunger for homely Telugu cuisine. Ready to indulge in your favorite comfort food? Register and place your order now!</p>
        </section>
      </section>
      
      {/* <footer>Copyright 2024 @ Inti Bhojanam. All rights reserved.</footer> */}
      <Footer/>
    </>
  );
}

export default Homepage;
