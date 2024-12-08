// import React, { useState, useEffect } from 'react'; 
// import './Cart.css'; 
// import Header from './Header'; 
// import Footer from './Footer'; 
// import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// const Cart = () => {
//   const [cart, setCart] = useState([]); // State to hold cart items
//   const navigate = useNavigate(); // Initialize navigate

//   useEffect(() => {
//     // Effect to retrieve saved cart items from local storage when the component mounts
//     const savedCart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items or initialize to an empty array
//     setCart(savedCart); // Update cart state with saved items
//   }, []); // Empty dependency array ensures this runs only once

//   const handleRemoveFromCart = (itemToRemove) => {
//     // Function to remove an item from the cart
//     const updatedCart = cart.filter(item => item._id !== itemToRemove._id); // Filter out the item to remove
//     setCart(updatedCart); // Update the cart state
//     localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage with the new cart
//   };

//   const handleQuantityChange = (item, increment) => {
//     // Function to change the quantity of an item in the cart
//     const updatedCart = cart.map(cartItem => {
//       if (cartItem._id === item._id) { // Check if the current item is the one we want to change
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
//       let price = item.price;
      
//       // Ensure the price is a number, and handle both string and number formats
//       if (typeof price === 'string') {
//         price = price.replace('Rs. ', ''); // Remove 'Rs.' if the price is a string
//       }

//       const numericPrice = parseFloat(price); // Parse price as a float
//       if (isNaN(numericPrice)) return total; // If price is invalid, don't add to the total

//       return total + (numericPrice * item.quantity); // Add item's total price (price * quantity) to the total
//     }, 0);
//   };

//   const handleCheckout = () => {
//     // Function to handle checkout
//     // For now, we just log the checkout process or navigate to a checkout page
//     console.log('Proceeding to checkout...');
//     navigate('/checkout'); // Navigate to the checkout page
//   };

//   return (
//     <>
//       <Header user={localStorage.getItem('user')} token={localStorage.getItem('token')} cartCount={cart.length} /> {/* Pass total quantity to Header */}
//       <div className='background'>
//         <div className="cart-container">
//           <h2>Your Cart</h2>
//           {cart.length === 0 ? (
//             <p>Your cart is empty. Start adding items!</p> // Message if the cart is empty
//           ) : (
//             <>
//               <div className="cart-items">
//                 {cart.map(item => (
//                   <div key={item._id} className="cart-item">
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
//               <button className="checkout-button" onClick={handleCheckout}>Checkout</button> {/* Checkout button */}
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
import axios from 'axios';
import './Cart.css';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          console.error('No user found in localStorage');
          return;
        }
  
        const { id: userId } = JSON.parse(user);
  
        if (!userId) {
          console.error('User ID is missing in localStorage');
          return;
        }
  
        // Check if cart is already fetched and populated
        if (cart.length > 0) {
          console.log('Cart is already populated, skipping fetch.');
          return; // Skip the fetch if the cart is already populated
        }
  
        // Fetch cart details only if not already populated
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        const cartItems = response.data.items;
  
        // If cart is empty, delete it from the database
        if (cartItems.length === 0) {
          console.log('Cart is empty. Deleting from database...');
          const deleteResponse = await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);
  
          if (deleteResponse.status === 200) {
            console.log('Cart deleted successfully');
          }
          setCart([]); // Clear cart state
        } else {
          setCart(cartItems); // Update cart state with fetched items
        }
      } catch (error) {
        console.error('Error fetching cart details:', error);
      }
    };
  
    fetchCartDetails();
  }, [cart]); // Add 'cart' as a dependency to avoid re-running unnecessarily
  
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.menuItemId.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleRemoveFromCart = async (itemToRemove) => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Get user details
      const userId = user.id;
  
      await axios.delete(`http://localhost:5000/api/cart/remove`, {
        data: {
          userId,
          menuItemId: itemToRemove.menuItemId._id,
        },
      });
  
      setCart(cart.filter(item => item.menuItemId._id !== itemToRemove.menuItemId._id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  

  const handleQuantityChange = async (item, change) => {
    try {
      const newQuantity = item.quantity + change;
  
      if (newQuantity <= 0) {
        await handleRemoveFromCart(item);
      } else {
        const user = JSON.parse(localStorage.getItem('user')); // Assuming user details are stored in localStorage
        const userId = user.id;
  
        await axios.put(`http://localhost:5000/api/cart/update`, {
          userId,
          menuItemId: item.menuItemId._id,
          quantity: newQuantity,
        });
  
        setCart(cart.map(cartItem =>
          cartItem.menuItemId._id === item.menuItemId._id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        ));
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  const handleCheckout = () => {
    // Function to handle checkout
    // For now, we just log the checkout process or navigate to a checkout page
    console.log('Proceeding to checkout...');
    navigate('/checkout'); // Navigate to the checkout page
  };
  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    alert('Logout Successfull.');
    navigate('/');
  };

  return (
    <>
      <Header onLogout = {onLogout} user={localStorage.getItem('user')} token={localStorage.getItem('token')} cartCount={cart.length} />
      <div className='background'>
        <div className="cart-container">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. Start adding items!</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.menuItemId._id} className="cart-item">
                    <img src={item.menuItemId.image} alt={item.menuItemId.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.menuItemId.name}</h4>
                      <p><i>From: {item.menuItemId.restaurantId.name}</i></p>
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                      </div>
                      <p><b>Rs. {item.menuItemId.price}</b></p>
                    </div>
                    <button className="remove-button" onClick={() => handleRemoveFromCart(item)}>Remove</button>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: Rs. {calculateTotal()}</h3>
              </div>
              <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
