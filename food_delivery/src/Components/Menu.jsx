import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
  const activeUser = localStorage.getItem('user');
  const parsedUser = JSON.parse(activeUser);
  // console.log(parsedUser.role);
  const userRole = parsedUser.role;
  // console.log(userRole);
  // console.log(typeof(userRole));
  const handleAddToCart = async (item) => {
    try {
      const itemWithRestaurant = { ...item, restaurantName: restaurant.name };
  
      const itemInCart = cart.find((cartItem) => cartItem._id === itemWithRestaurant._id);
  
      let updatedCart;
      if (itemInCart) {
        updatedCart = cart.map((cartItem) =>
          cartItem._id === itemWithRestaurant._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...cart, { ...itemWithRestaurant, quantity: 1 }];
      }
  
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      displayMessage(`${itemWithRestaurant.name} added to cart!`);
  
      if (updatedCart.length === 1) {
        await postCartToDatabase(updatedCart); // Create new cart in DB
      } else {
        await updateCartInDatabase(updatedCart); // Update existing cart in DB
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
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
    const userId = parsedUser?.id;

    if (!userId) {
      throw new Error("User ID is not available in localStorage.");
    }

    // Fetch existing cart from the database
    const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
    const existingCart = response.data;

    // Prepare updated cart items
    const mergedCartItems = updatedCart.map((cartItem) => {
      const existingItem = existingCart.items.find(
        (item) => item.menuItemId === cartItem._id
      );
      return {
        menuItemId: cartItem._id,
        quantity: existingItem
          ? cartItem.quantity // Use the new quantity from the state
          : cartItem.quantity,
      };
    });

    // Update the cart in the database
    await axios.put(`http://localhost:5000/api/cart/update/${existingCart._id}`, {
      userId,
      items: mergedCartItems,
    });

    console.log("Cart updated in the database.");
    // displayMessage(`Cart Updated.`);
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
      updateCartInDatabase(updatedCart); // Call the API to update the database
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
      updateCartInDatabase(updatedCart); // Call the API to update the database
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

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    alert('Logout Successfull.');
    navigate('/');
  };

  return (
    <>
      <Header
        user={localStorage.getItem('user')}
        cartCount={cart && cart.length}
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={onLogout}
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
              {(userRole === 'admin') &&
                (<button onClick={() => handleEditMenuClick(item)}>Edit</button>) 
              }
            </div>
          ))}
          {(userRole === 'admin') && (
          <div className="add-menu-card">
            <button className="add-menu-button" onClick={handleAddMenuClick}>
              + Add New Menu Item
            </button>
          </div>) }
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
