// import React, { useState, useEffect } from 'react'; 
// import './Cart.css'; 
// import Header from './Header'; 
// import Footer from './Footer'; 

// const Cart = () => {
//   const [cart, setCart] = useState([]); // State to hold cart items

//   useEffect(() => {
//     // Effect to retrieve saved cart items from local storage when the component mounts
//     const savedCart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items or initialize to an empty array
//     setCart(savedCart); // Update cart state with saved items
//   }, []); // Empty dependency array ensures this runs only once

//   const handleRemoveFromCart = (itemToRemove) => {
//     // Function to remove an item from the cart
//     const updatedCart = cart.filter(item => item.id !== itemToRemove.id); // Filter out the item to remove
//     setCart(updatedCart); // Update the cart state
//     localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage with the new cart
//   };

//   const handleQuantityChange = (item, increment) => {
//     // Function to change the quantity of an item in the cart
//     const updatedCart = cart.map(cartItem => {
//       if (cartItem.id === item.id) { // Check if the current item is the one we want to change
//         const newQuantity = cartItem.quantity + increment; // Calculate new quantity
//         if (newQuantity <= 0) {
//           return null; // If quantity is 0 or less, mark for removal
//         }
//         return { ...cartItem, quantity: newQuantity }; // Return the updated item
//       }
//       return cartItem; // Return unchanged items
//     }).filter(cartItem => cartItem !== null); // Remove items marked for removal

//     setCart(updatedCart); // Update the cart state
//     localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to local storage
//   };

//   const calculateTotal = () => {
//     // Function to calculate the total price of items in the cart
//     return cart.reduce((total, item) => {
//       const price = parseInt(item.price.replace('Rs. ', '')); // Extract price as a number
//       return total + (price * item.quantity); // Add item's total price (price * quantity) to the total
//     }, 0);
//   };

//   return (
//     <>
//       <Header cartCount={cart.reduce((count, item) => count + item.quantity, 0)} /> {/* Pass total quantity to Header */}
//       <div className='background'>
//         <div className="cart-container">
//           <h2>Your Cart</h2>
//           {cart.length === 0 ? (
//             <p>Your cart is empty. Start adding items!</p> // Message if the cart is empty
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map(item => (
//                   <div key={item.id} className="cart-item">
//                     <img src={item.image} alt={item.name} className="cart-item-image" /> {/* Display item image */}
//                     <div className="cart-item-details">
//                       <h4>{item.name}</h4> {/* Display item name */}
//                       <p><i>From: {item.restaurantName}</i></p> {/* Display restaurant name */}
//                       <div className="quantity-control">
//                         <button onClick={() => handleQuantityChange(item, -1)}>-</button> {/* Decrease quantity */}
//                         <span>{item.quantity}</span> {/* Display current quantity */}
//                         <button onClick={() => handleQuantityChange(item, 1)}>+</button> {/* Increase quantity */}
//                       </div>
//                       <p><b>{item.price}</b></p> {/* Display item price */}
//                     </div>
//                     <button className="remove-button" onClick={() => handleRemoveFromCart(item)}>Remove</button> {/* Remove item button */}
//                   </div>
//                 ))}
//               </div>
//               <div className="cart-total">
//                 <h3>Total: Rs. {calculateTotal()}</h3> {/* Display total price */}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       <Footer /> {/* Render Footer component */}
//     </>
//   );
// };

// export default Cart; // Export the Cart component for use in other parts of the app

import React, { useState, useEffect } from 'react'; 
import './Cart.css'; 
import Header from './Header'; 
import Footer from './Footer'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const Cart = () => {
  const [cart, setCart] = useState([]); // State to hold cart items
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Effect to retrieve saved cart items from local storage when the component mounts
    const savedCart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items or initialize to an empty array
    setCart(savedCart); // Update cart state with saved items
  }, []); // Empty dependency array ensures this runs only once

  const handleRemoveFromCart = (itemToRemove) => {
    // Function to remove an item from the cart
    const updatedCart = cart.filter(item => item.id !== itemToRemove.id); // Filter out the item to remove
    setCart(updatedCart); // Update the cart state
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage with the new cart
  };

  const handleQuantityChange = (item, increment) => {
    // Function to change the quantity of an item in the cart
    const updatedCart = cart.map(cartItem => {
      if (cartItem.id === item.id) { // Check if the current item is the one we want to change
        const newQuantity = cartItem.quantity + increment; // Calculate new quantity
        if (newQuantity <= 0) {
          return null; // If quantity is 0 or less, mark for removal
        }
        return { ...cartItem, quantity: newQuantity }; // Return the updated item
      }
      return cartItem; // Return unchanged items
    }).filter(cartItem => cartItem !== null); // Remove items marked for removal

    setCart(updatedCart); // Update the cart state
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart to local storage
  };

  const calculateTotal = () => {
    // Function to calculate the total price of items in the cart
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace('Rs. ', '')); // Extract price as a number
      return total + (price * item.quantity); // Add item's total price (price * quantity) to the total
    }, 0);
  };

  const handleCheckout = () => {
    // Function to handle checkout
    // For now, we just log the checkout process or navigate to a checkout page
    console.log('Proceeding to checkout...');
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <>
      <Header cartCount={cart.reduce((count, item) => count + item.quantity, 0)} /> {/* Pass total quantity to Header */}
      <div className='background'>
        <div className="cart-container">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. Start adding items!</p> // Message if the cart is empty
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" /> {/* Display item image */}
                    <div className="cart-item-details">
                      <h4>{item.name}</h4> {/* Display item name */}
                      <p><i>From: {item.restaurantName}</i></p> {/* Display restaurant name */}
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item, -1)}>-</button> {/* Decrease quantity */}
                        <span>{item.quantity}</span> {/* Display current quantity */}
                        <button onClick={() => handleQuantityChange(item, 1)}>+</button> {/* Increase quantity */}
                      </div>
                      <p><b>{item.price}</b></p> {/* Display item price */}
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(item)}>Remove</button> {/* Remove item button */}
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: Rs. {calculateTotal()}</h3> {/* Display total price */}
              </div>
              <button className="checkout-button" onClick={handleCheckout}>Checkout</button> {/* Checkout button */}
            </>
          )}
        </div>
      </div>
      <Footer /> {/* Render Footer component */}
    </>
  );
};

export default Cart; // Export the Cart component for use in other parts of the app
