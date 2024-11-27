import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
    // Fetch the menu items for the restaurant from the backend using axios
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menu-items/restaurant/${restaurant._id}`);
        console.log(response.data);  // Log the response to inspect the data
        setMenuItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [restaurant._id]);

  // Modal states for adding/editing menu items
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

  const handleAddToCart = (item) => {
    const itemWithRestaurant = {
      ...item,
      restaurantName: restaurant.name,
    };

    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.id === itemWithRestaurant.id);

      let updatedCart;
      if (itemInCart) {
        updatedCart = prevCart.map((cartItem) =>
          cartItem.id === itemWithRestaurant.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...prevCart, { ...itemWithRestaurant, quantity: 1 }];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      displayMessage(`${itemWithRestaurant.name} added to cart!`);
      return updatedCart;
    });
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  // Get quantity of the item in cart
  const getItemQuantity = (itemId) => {
    const itemInCart = cart.find((cartItem) => cartItem.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };

  // Ensure filteredMenuItems is handled as an array
  const filteredMenuItems = Array.isArray(menuItems)
  ? menuItems.filter((item) =>
      item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];


  // Handle increasing the quantity
  const handleIncreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Handle decreasing the quantity
  const handleDecreaseQuantity = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0); // Remove item if quantity reaches 0
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Open add/edit modal
  const handleAddMenuClick = () => {
    setNewMenuItem({ id: '', name: '', price: '', image: '', description: '' });
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

  // Function to add new menu item to the database using axios
  const handleAddNewMenuItem = async () => {
    const newMenuItemData = {
      name: newMenuItem.name,
      price: newMenuItem.price,
      image: newMenuItem.image,
      description: newMenuItem.description,
      restaurantId: restaurant._id, // Add the restaurant ID
    };

    try {
      const response = await axios.post('http://localhost:5000/api/menu-items', newMenuItemData);
      if (response.status === 201) {
        // Add the new menu item to the local state
        setMenuItems([...menuItems, newMenuItemData]);
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

  // Function to edit menu item (not used in this code, but you can implement similarly)
  const handleEditMenuItem = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/menu-items/${selectedMenuItem._id}`, newMenuItem);
      if (response.status === 200) {
        const updatedMenuItems = menuItems.map((item) =>
          item._id === selectedMenuItem._id ? {...item,...newMenuItem} : item
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
      <Header user={localStorage.getItem('user')} cartCount={cart.length} showSearchBar={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="header-div">
        <h2>{restaurant.name} Menu</h2>
        <p>{restaurant.description}</p>

        {message && <div className="notification">{message}</div>}

        <div className="menu-list">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-image" />
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p><b>{item.price}</b></p>

              {/* Conditionally render Add to Cart button if quantity is 0 */}
              {getItemQuantity(item.id) === 0 && (
                <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              )}

              {/* Display quantity and + / - buttons when item is in the cart */}
              {getItemQuantity(item.id) > 0 && (
                <div className="item-quantity">
                  <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                  <span> Quantity: {getItemQuantity(item.id)} </span>
                  <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
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

      {/* Modal for adding a new menu item */}
      {isAddMenuModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Menu Item</h2>
            <label>Name:</label>
            <input type="text" name="name" value={newMenuItem.name} onChange={handleMenuInputChange} placeholder="Menu Item Name" />
            <label>Price:</label>
            <input type="text" name="price" value={newMenuItem.price} onChange={handleMenuInputChange} placeholder="Price" />
            <label>Image URL:</label>
            <input type="text" name="image" value={newMenuItem.image} onChange={handleMenuInputChange} placeholder="Image URL" />
            <label>Description:</label>
            <textarea name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description"></textarea>

            <button onClick={handleAddNewMenuItem}>Add Menu Item</button>
            <button onClick={handleCloseAddMenuModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for editing a menu item */}
      {isEditMenuModalOpen && selectedMenuItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Menu Item</h2>
            <label>Name:</label>
            <input type="text" name="name" value={newMenuItem.name} onChange={handleMenuInputChange} placeholder="Menu Item Name" />
            <label>Price:</label>
            <input type="text" name="price" value={newMenuItem.price} onChange={handleMenuInputChange} placeholder="Price" />
            <label>Image URL:</label>
            <input type="text" name="image" value={newMenuItem.image} onChange={handleMenuInputChange} placeholder="Image URL" />
            <label>Description:</label>
            <textarea name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description"></textarea>

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
