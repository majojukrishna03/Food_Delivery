// import React, { useEffect, useState } from 'react';
// import { useParams, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Header from './Header';
// import Footer from './Footer';
// import './Menu.css';

// const Menu = () => {
//   const location = useLocation();
//   const restaurant = location.state;

//   const [menuItems, setMenuItems] = useState([]);
//   const [cart, setCart] = useState(() => {
//     const storedCart = localStorage.getItem('cart');
//     return storedCart ? JSON.parse(storedCart) : [];
//   });
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   useEffect(() => {
//     // Fetch the menu items for the restaurant from the backend using axios
//     const fetchMenuItems = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/menu-items/restaurant/${restaurant._id}`);
//         console.log(response.data);  // Log the response to inspect the data
//         setMenuItems(response.data);
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//       }
//     };

//     fetchMenuItems();
//   }, [restaurant._id]);

//   // Modal states for adding/editing menu items
//   const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
//   const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
//   const [newMenuItem, setNewMenuItem] = useState({
//     name: '',
//     price: '',
//     image: '',
//     description: '',
//     restaurantId: restaurant._id,
//   });
//   const [selectedMenuItem, setSelectedMenuItem] = useState(null);

//   const handleAddToCart = (item) => {
//     const itemWithRestaurant = {
//       ...item,
//       restaurantName: restaurant.name,
//     };

//     setCart((prevCart) => {
//       const itemInCart = prevCart.find((cartItem) => cartItem._id === itemWithRestaurant._id);

//       let updatedCart;
//       if (itemInCart) {
//         updatedCart = prevCart.map((cartItem) =>
//           cartItem._id === itemWithRestaurant._id
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         );
//       } else {
//         updatedCart = [...prevCart, { ...itemWithRestaurant, quantity: 1 }];
//       }

//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//       displayMessage(`${itemWithRestaurant.name} added to cart!`);
//       return updatedCart;
//     });
//   };

//   const displayMessage = (msg) => {
//     setMessage(msg);
//     setTimeout(() => {
//       setMessage('');
//     }, 3000);
//   };

//   // Get quantity of the item in cart
//   const getItemQuantity = (itemId) => {
//     const itemInCart = cart.find((cartItem) => cartItem._id === itemId);
//     return itemInCart ? itemInCart.quantity : 0;
//   };

//   // Ensure filteredMenuItems is handled as an array
//   const filteredMenuItems = Array.isArray(menuItems)
//   ? menuItems.filter((item) =>
//       item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   : [];


//   // Handle increasing the quantity
//   const handleIncreaseQuantity = (itemId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.map((cartItem) =>
//         cartItem._id === itemId
//           ? { ...cartItem, quantity: cartItem.quantity + 1 }
//           : cartItem
//       );
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };

//   // Handle decreasing the quantity
//   const handleDecreaseQuantity = (itemId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart
//         .map((cartItem) =>
//           cartItem._id === itemId
//             ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
//             : cartItem
//         )
//         .filter((cartItem) => cartItem.quantity > 0); // Remove item if quantity reaches 0
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };

//   // Open add/edit modal
//   const handleAddMenuClick = () => {
//     setNewMenuItem({ id: '', name: '', price: '', image: '', description: '' });
//     setIsAddMenuModalOpen(true);
//   };

//   const handleEditMenuClick = (item) => {
//     setSelectedMenuItem(item);
//     setNewMenuItem({ ...item });
//     setIsEditMenuModalOpen(true);
//   };

//   const handleCloseAddMenuModal = () => {
//     setIsAddMenuModalOpen(false);
//   };

//   const handleCloseEditMenuModal = () => {
//     setIsEditMenuModalOpen(false);
//   };

//   const handleMenuInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewMenuItem({ ...newMenuItem, [name]: value });
//   };

//   // Function to add new menu item to the database using axios
//   const handleAddNewMenuItem = async () => {
//     const newMenuItemData = {
//       name: newMenuItem.name,
//       price: newMenuItem.price,
//       image: newMenuItem.image,
//       description: newMenuItem.description,
//       restaurantId: restaurant._id, // Add the restaurant ID
//     };

//     try {
//       const response = await axios.post('http://localhost:5000/api/menu-items', newMenuItemData);
//       if (response.status === 201) {
//         // Add the new menu item to the local state
//         setMenuItems([...menuItems, newMenuItemData]);
//         setIsAddMenuModalOpen(false);
//         displayMessage('Menu item added successfully!');
//       } else {
//         displayMessage('Failed to add menu item.');
//       }
//     } catch (error) {
//       console.error('Error adding menu item:', error);
//       displayMessage('Error adding menu item.');
//     }
//   };

//   // Function to edit menu item (not used in this code, but you can implement similarly)
//   const handleEditMenuItem = async () => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/menu-items/${selectedMenuItem._id}`, newMenuItem);
//       if (response.status === 200) {
//         const updatedMenuItems = menuItems.map((item) =>
//           item._id === selectedMenuItem._id ? {...item,...newMenuItem} : item
//         );
//         setMenuItems(updatedMenuItems);
//         setIsEditMenuModalOpen(false);
//         displayMessage('Menu item updated successfully!');
//       } else {
//         displayMessage('Failed to update menu item.');
//       }
//     } catch (error) {
//       console.error('Error editing menu item:', error);
//       displayMessage('Error editing menu item.');
//     }
//   };

//   return (
//     <>
//       <Header user={localStorage.getItem('user')} cartCount={cart.length} showSearchBar={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//       <div className="header-div">
//         <h2>{restaurant.name} Menu</h2>
//         <p>{restaurant.description}</p>

//         {message && <div className="notification">{message}</div>}

//         <div className="menu-list">
//           {filteredMenuItems.map((item) => (
//             <div key={item.id} className="menu-item">
//               <img src={item.image} alt={item.name} className="menu-image" />
//               <h4>{item.name}</h4>
//               <p>{item.description}</p>
//               <p><b>{item.price}</b></p>

//               {/* Conditionally render Add to Cart button if quantity is 0 */}
//               {getItemQuantity(item.id) === 0 && (
//                 <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
//               )}

//               {/* Display quantity and + / - buttons when item is in the cart */}
//               {getItemQuantity(item.id) > 0 && (
//                 <div className="item-quantity">
//                   <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
//                   <span> Quantity: {getItemQuantity(item.id)} </span>
//                   <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
//                 </div>
//               )}

//               <button onClick={() => handleEditMenuClick(item)}>Edit</button>
//             </div>
//           ))}

//           <div className="add-menu-card">
//             <button className="add-menu-button" onClick={handleAddMenuClick}>
//               + Add New Menu Item
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Modal for adding a new menu item */}
//       {isAddMenuModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Add New Menu Item</h2>
//             <label>Name:</label>
//             <input type="text" name="name" value={newMenuItem.name} onChange={handleMenuInputChange} placeholder="Menu Item Name" />
//             <label>Price:</label>
//             <input type="text" name="price" value={newMenuItem.price} onChange={handleMenuInputChange} placeholder="Price" />
//             <label>Image URL:</label>
//             <input type="text" name="image" value={newMenuItem.image} onChange={handleMenuInputChange} placeholder="Image URL" />
//             <label>Description:</label>
//             <textarea name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description"></textarea>

//             <button onClick={handleAddNewMenuItem}>Add Menu Item</button>
//             <button onClick={handleCloseAddMenuModal}>Close</button>
//           </div>
//         </div>
//       )}

//       {/* Modal for editing a menu item */}
//       {isEditMenuModalOpen && selectedMenuItem && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Edit Menu Item</h2>
//             <label>Name:</label>
//             <input type="text" name="name" value={newMenuItem.name} onChange={handleMenuInputChange} placeholder="Menu Item Name" />
//             <label>Price:</label>
//             <input type="text" name="price" value={newMenuItem.price} onChange={handleMenuInputChange} placeholder="Price" />
//             <label>Image URL:</label>
//             <input type="text" name="image" value={newMenuItem.image} onChange={handleMenuInputChange} placeholder="Image URL" />
//             <label>Description:</label>
//             <textarea name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description"></textarea>

//             <button onClick={handleEditMenuItem}>Update Menu Item</button>
//             <button onClick={handleCloseEditMenuModal}>Close</button>
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// };

// export default Menu;

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import Header from './Header';
// import Footer from './Footer';
// import './Menu.css';

// const Menu = () => {
//   const location = useLocation();
//   const restaurant = location.state;

//   const [menuItems, setMenuItems] = useState([]);
//   const [cart, setCart] = useState(() => {
//     const storedCart = localStorage.getItem('cart');
//     return storedCart ? JSON.parse(storedCart) : [];
//   });
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Modal state for adding and editing menu items
//   const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
//   const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
//   const [newMenuItem, setNewMenuItem] = useState({
//     name: '',
//     price: '',
//     image: '',
//     description: '',
//     restaurantId: restaurant._id,
//   });
//   const [selectedMenuItem, setSelectedMenuItem] = useState(null);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/menu-items/restaurant/${restaurant._id}`);
//         setMenuItems(response.data);
//       } catch (error) {
//         console.error('Error fetching menu items:', error);
//       }
//     };

//     fetchMenuItems();
//   }, [restaurant._id]);

//   const handleAddToCart = async (item) => {
//     try {
//       const storedUser = localStorage.getItem('user');
//       const user = JSON.parse(storedUser);
//       const userId = user.id;
  
//       // Fetch the existing cart from the database
//       const existingCartResponse = await axios.get(`http://localhost:5000/api/cart/${userId}`);
//       const existingCart = existingCartResponse.data;
  
//       if (existingCart) {
//         // If the cart exists, check if the item is already in the cart
//         const itemInCart = existingCart.items.find(
//           (cartItem) => cartItem.menuItemId === item._id
//         );
  
//         let updatedItems;
//         if (itemInCart) {
//           // Update the quantity of the item
//           updatedItems = existingCart.items.map((cartItem) =>
//             cartItem.menuItemId === item._id
//               ? { ...cartItem, quantity: cartItem.quantity + 1 }
//               : cartItem
//           );
//         } else {
//           // Add the new item to the cart
//           updatedItems = [
//             ...existingCart.items,
//             { menuItemId: item._id, quantity: 1 },
//           ];
//         }
  
//         // Update the cart in the database
//         const updatedCartData = {
//           userId,
//           items: updatedItems,
//         };
  
//         await axios.put(`http://localhost:5000/api/cart/${existingCart._id}`, updatedCartData);
//         displayMessage(`${item.name} added to cart!`);
//       } else {
//         // If no cart exists, create a new cart
//         const newCartData = {
//           userId,
//           items: [{ menuItemId: item._id, quantity: 1 }],
//         };
  
//         await axios.post('http://localhost:5000/api/cart/add', newCartData);
//         displayMessage('Cart created successfully!');
//       }
  
//       // Update local cart state for UI
//       setCart((prevCart) => {
//         const itemInLocalCart = prevCart.find(
//           (cartItem) => cartItem.menuItemId === item._id
//         );
  
//         if (itemInLocalCart) {
//           return prevCart.map((cartItem) =>
//             cartItem.menuItemId === item._id
//               ? { ...cartItem, quantity: cartItem.quantity + 1 }
//               : cartItem
//           );
//         } else {
//           return [...prevCart, { menuItemId: item._id, quantity: 1 }];
//         }
//       });
//     } catch (error) {
//       console.error('Error managing cart in database:', error);
//       displayMessage('Error managing cart in database.');
//     }
//   };
  

//   const displayMessage = (msg) => {
//     setMessage(msg);
//     setTimeout(() => {
//       setMessage('');
//     }, 3000);
//   };

//   const getItemQuantity = (itemId) => {
//     const itemInCart = cart.find((cartItem) => cartItem._id === itemId);
//     return itemInCart ? itemInCart.quantity : 0;
//   };

//   const filteredMenuItems = Array.isArray(menuItems)
//     ? menuItems.filter((item) =>
//         item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     : [];

//   const handleIncreaseQuantity = (itemId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.map((cartItem) =>
//         cartItem._id === itemId
//           ? { ...cartItem, quantity: cartItem.quantity + 1 }
//           : cartItem
//       );
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };

//   const handleDecreaseQuantity = (itemId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart
//         .map((cartItem) =>
//           cartItem._id === itemId
//             ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
//             : cartItem
//         )
//         .filter((cartItem) => cartItem.quantity > 0); 
//       localStorage.setItem('cart', JSON.stringify(updatedCart));
//       return updatedCart;
//     });
//   };

//   const handleAddMenuClick = () => {
//     setNewMenuItem({ id: '', name: '', price: '', image: '', description: '' });
//     setIsAddMenuModalOpen(true);
//   };

//   const handleEditMenuClick = (item) => {
//     setSelectedMenuItem(item);
//     setNewMenuItem({ ...item });
//     setIsEditMenuModalOpen(true);
//   };

//   const handleCloseAddMenuModal = () => {
//     setIsAddMenuModalOpen(false);
//   };

//   const handleCloseEditMenuModal = () => {
//     setIsEditMenuModalOpen(false);
//   };

//   const handleMenuInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewMenuItem({ ...newMenuItem, [name]: value });
//   };

//   const handleAddNewMenuItem = async () => {
//     const newMenuItemData = {
//       name: newMenuItem.name,
//       price: newMenuItem.price,
//       image: newMenuItem.image,
//       description: newMenuItem.description,
//       restaurantId: restaurant._id,
//     };

//     try {
//       const response = await axios.post('http://localhost:5000/api/menu-items', newMenuItemData);
//       if (response.status === 201) {
//         setMenuItems([...menuItems, newMenuItemData]);
//         setIsAddMenuModalOpen(false);
//         displayMessage('Menu item added successfully!');
//       } else {
//         displayMessage('Failed to add menu item.');
//       }
//     } catch (error) {
//       console.error('Error adding menu item:', error);
//       displayMessage('Error adding menu item.');
//     }
//   };

//   const handleEditMenuItem = async () => {
//     try {
//       const response = await axios.put(`http://localhost:5000/api/menu-items/${selectedMenuItem._id}`, newMenuItem);
//       if (response.status === 200) {
//         const updatedMenuItems = menuItems.map((item) =>
//           item._id === selectedMenuItem._id ? { ...item, ...newMenuItem } : item
//         );
//         setMenuItems(updatedMenuItems);
//         setIsEditMenuModalOpen(false);
//         displayMessage('Menu item updated successfully!');
//       } else {
//         displayMessage('Failed to update menu item.');
//       }
//     } catch (error) {
//       console.error('Error editing menu item:', error);
//       displayMessage('Error editing menu item.');
//     }
//   };

//   return (
//     <>
//       <Header user={localStorage.getItem('user')} cartCount={cart.length} showSearchBar={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

//       <div className="header-div">
//         <h2>{restaurant.name} Menu</h2>
//         <p>{restaurant.description}</p>

//         {message && <div className="notification">{message}</div>}

//         <div className="menu-list">
//           {filteredMenuItems.map((item) => (
//             <div key={item._id} className="menu-item">
//               <img src={item.image} alt={item.name} />
//               <div className="item-details">
//                 <h3>{item.name}</h3>
//                 <p>{item.description}</p>
//                 <p>₹{item.price}</p>
//                 <div className="cart-actions">
//                   <button onClick={() => handleAddToCart(item)}>
//                     {getItemQuantity(item._id) === 0 ? 'Add to Cart' : 'Added'}
//                   </button>
//                   {getItemQuantity(item._id) > 0 && (
//                     <div className="quantity-buttons">
//                       <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
//                       <span>Quantity : {getItemQuantity(item._id)}</span>
//                       <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
//                     </div>
//                   )}
//                   <button onClick={() => handleEditMenuClick(item)}>Edit</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div className="add-menu-card">
//             <button className="add-menu-button" onClick={handleAddMenuClick}>
//               + Add New Menu Item
//             </button>
//           </div>
//         </div>
//       </div>

//       <Footer />

//       {/* Add/Edit Modal logic */}
//       {isAddMenuModalOpen && (
//         <div className="modal">
//           <h2>Add New Menu Item</h2>
//           <input
//             type="text"
//             name="name"
//             value={newMenuItem.name}
//             onChange={handleMenuInputChange}
//             placeholder="Item Name"
//           />
//           <input
//             type="text"
//             name="price"
//             value={newMenuItem.price}
//             onChange={handleMenuInputChange}
//             placeholder="Price"
//           />
//           <input
//             type="text"
//             name="image"
//             value={newMenuItem.image}
//             onChange={handleMenuInputChange}
//             placeholder="Image URL"
//           />
//           <textarea
//             name="description"
//             value={newMenuItem.description}
//             onChange={handleMenuInputChange}
//             placeholder="Description"
//           />
//           <button onClick={handleAddNewMenuItem}>Add Item</button>
//           <button onClick={handleCloseAddMenuModal}>Cancel</button>
//         </div>
//       )}

//       {isEditMenuModalOpen && selectedMenuItem && (
//         <div className="modal">
//           <h2>Edit Menu Item</h2>
//           <input
//             type="text"
//             name="name"
//             value={newMenuItem.name}
//             onChange={handleMenuInputChange}
//             placeholder="Item Name"
//           />
//           <input
//             type="text"
//             name="price"
//             value={newMenuItem.price}
//             onChange={handleMenuInputChange}
//             placeholder="Price"
//           />
//           <input
//             type="text"
//             name="image"
//             value={newMenuItem.image}
//             onChange={handleMenuInputChange}
//             placeholder="Image URL"
//           />
//           <textarea
//             name="description"
//             value={newMenuItem.description}
//             onChange={handleMenuInputChange}
//             placeholder="Description"
//           />
//           <button onClick={handleEditMenuItem}>Update Item</button>
//           <button onClick={handleCloseEditMenuModal}>Cancel</button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Menu;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './Menu.css';

const Menu = () => {
  const location = useLocation();
  const restaurant = location.state;

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/menu-items/restaurant/${restaurant._id}`
        );
        // console.log(response.data); // Log the response to inspect the data
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [restaurant._id]);

  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    restaurantId: restaurant._id,
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleAddToCart = async (item) => {
    const itemWithRestaurant = {
      ...item,
      restaurantName: restaurant.name,
    };
  
    setCart((prevCart) => {
      const itemInCart = prevCart.find(
        (cartItem) => cartItem._id === itemWithRestaurant._id
      );
  
      let updatedCart;
      if (itemInCart) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem._id === itemWithRestaurant._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...itemWithRestaurant, quantity: 1 }];
      }
  
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      displayMessage(`${itemWithRestaurant.name} added to cart!`);
      setCart(updatedCart);
  
      // If this is the first item being added to the cart, create a new cart record
      if (cart.length === 1) {
        postCartToDatabase(updatedCart);
      } 

      if (cart.length > 1) {
        updateCartInDatabase(updatedCart);
      }

      // return updatedCart;
    });
  };

  const postCartToDatabase = async (cartItems) => {
    try {
      const user = localStorage.getItem('user');
      if (!user) {
        throw new Error('User is not logged in');
      }
  
      const parsedUser = JSON.parse(user);
      if (!parsedUser || !parsedUser.id) {
        throw new Error('Invalid user data');
      }
  
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart items are required');
      }
  
      const userId = parsedUser.id; // Retrieve userId from local storage
  
      const response = await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        items: cartItems.map(item => ({
          menuItemId: item._id,
          quantity: item.quantity,
        })),
      });
  
      console.log('Cart created:', response.data);
    } catch (error) {
      console.error('Error creating cart in database:', error);
    }
  };

  // Update cart record in the database
  const updateCartInDatabase = async (updatedCart) => {
    try {
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const userId = parsedUser.id;

      if (!userId) {
        throw new Error("User ID is not available in localStorage.");
      }

      // Fetch existing cart from the database
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      const existingCart = response.data;
      // console.log(existingCart._id);

      // Prepare updated cart items
      const mergedCartItems = updatedCart.map((cartItem) => {
        const existingItem = existingCart.items.find(
          (item) => item.menuItemId === cartItem._id
        );
        return {
          menuItemId: cartItem._id,
          quantity: existingItem
            ? existingItem.quantity + cartItem.quantity
            : cartItem.quantity,
        };
      });

      // Update the cart in the database
      await axios.put(`http://localhost:5000/api/cart/update/${existingCart._id}`, {
        userId,
        items: mergedCartItems,
      });

      console.log("Cart updated in the database.");
    } catch (error) {
      console.error("Error updating cart in the database:", error);
    }
  };
  
  
  

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const getItemQuantity = (itemId) => {
    const itemInCart = cart.find((cartItem) => cartItem._id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  const filteredMenuItems = Array.isArray(menuItems)
    ? menuItems.filter((item) =>
        item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleIncreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem._id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((cartItem) =>
          cartItem._id === itemId
            ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0); // Remove item if quantity reaches 0
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleAddMenuClick = () => {
    setNewMenuItem({ name: '', price: '', image: '', description: '' });
    setIsAddMenuModalOpen(true);
  };

  const handleEditMenuClick = (item) => {
    setSelectedMenuItem(item);
    setNewMenuItem({ ...item });
    setIsEditMenuModalOpen(true);
  };

  const handleCloseAddMenuModal = () => {
    setIsAddMenuModalOpen(false);
  };

  const handleCloseEditMenuModal = () => {
    setIsEditMenuModalOpen(false);
  };

  const handleMenuInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({ ...newMenuItem, [name]: value });
  };

  const handleAddNewMenuItem = async () => {
    const newMenuItemData = {
      name: newMenuItem.name,
      price: newMenuItem.price,
      image: newMenuItem.image,
      description: newMenuItem.description,
      restaurantId: restaurant._id,
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/menu-items',
        newMenuItemData
      );
      if (response.status === 201) {
        setMenuItems([...menuItems, response.data]);
        setIsAddMenuModalOpen(false);
        displayMessage('Menu item added successfully!');
      } else {
        displayMessage('Failed to add menu item.');
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      displayMessage('Error adding menu item.');
    }
  };

  const handleEditMenuItem = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/menu-items/${selectedMenuItem._id}`,
        newMenuItem
      );
      if (response.status === 200) {
        const updatedMenuItems = menuItems.map((item) =>
          item._id === selectedMenuItem._id ? { ...item, ...newMenuItem } : item
        );
        setMenuItems(updatedMenuItems);
        setIsEditMenuModalOpen(false);
        displayMessage('Menu item updated successfully!');
      } else {
        displayMessage('Failed to update menu item.');
      }
    } catch (error) {
      console.error('Error editing menu item:', error);
      displayMessage('Error editing menu item.');
    }
  };

  return (
    <>
      <Header
        user={localStorage.getItem('user')}
        cartCount={cart && cart.length}
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="header-div">
        <h2>{restaurant.name} Menu</h2>
        <p>{restaurant.description}</p>

        {message && <div className="notification">{message}</div>}

        <div className="menu-list">
          {filteredMenuItems.map((item) => (
            <div key={item._id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-image" />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><b>{item.price}</b></p>

              {getItemQuantity(item._id) === 0 && (
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              )}

              {getItemQuantity(item._id) > 0 && (
                <div className="item-quantity">
                  <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                  <span> Quantity: {getItemQuantity(item._id)} </span>
                  <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                </div>
              )}

              <button onClick={() => handleEditMenuClick(item)}>Edit</button>
            </div>
          ))}

          <div className="add-menu-card">
            <button className="add-menu-button" onClick={handleAddMenuClick}>
              + Add New Menu Item
            </button>
          </div>
        </div>
      </div>

      {isAddMenuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Menu Item</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newMenuItem.name}
              onChange={handleMenuInputChange}
              placeholder="Menu Item Name"
            />
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={newMenuItem.price}
              onChange={handleMenuInputChange}
              placeholder="Price"
            />
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newMenuItem.image}
              onChange={handleMenuInputChange}
              placeholder="Image URL"
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={newMenuItem.description}
              onChange={handleMenuInputChange}
              placeholder="Description"
            ></textarea>

            <button onClick={handleAddNewMenuItem}>Add Menu Item</button>
            <button onClick={handleCloseAddMenuModal}>Close</button>
          </div>
        </div>
      )}

      {isEditMenuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Menu Item</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newMenuItem.name}
              onChange={handleMenuInputChange}
            />
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={newMenuItem.price}
              onChange={handleMenuInputChange}
            />
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newMenuItem.image}
              onChange={handleMenuInputChange}
            />
            <label>Description:</label>
            <textarea
              name="description"
              value={newMenuItem.description}
              onChange={handleMenuInputChange}
            ></textarea>

            <button onClick={handleEditMenuItem}>Update Menu Item</button>
            <button onClick={handleCloseEditMenuModal}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Menu;
