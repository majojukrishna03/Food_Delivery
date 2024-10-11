import React, { useState, } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Menu.css';

const Menu = () => {
  const location = useLocation();
  const restaurant = location.state;
  const { id } = useParams();

  // Simulated menu data based on restaurant ID
  const menuData = {
    1: [
      { id: 'RR1', name: 'Rayalaseema Chicken Curry', price: 'Rs. 150', image: '/rayalaseema_chicken_curry.jpg', description: 'A spicy and flavorful chicken curry that features tender pieces of chicken cooked in a rich blend of aromatic spices and herbs, reflecting the bold flavors of Rayalaseema.' },
      { id: 'RR2', name: 'Spicy Rice', price: 'Rs. 120', image: '/spicy_rice.jpg', description: 'Fragrant rice tossed with a mix of spices and sautéed vegetables, offering a perfect balance of heat and flavor.' },
      { id: 'RR3', name: 'Chili Chicken Fry', price: 'Rs. 180', image: '/chili_chicken_fry.jpg', description: 'Crispy fried chicken pieces marinated in a zesty chili sauce, garnished with fresh herbs.' },
      { id: 'RR4', name: 'Fish Fry Delight', price: 'Rs. 200', image: '/fish_fry_delight.jpg', description: 'Fresh fish fillets seasoned with a blend of spices and deep-fried to golden perfection.' },
      { id: 'RR5', name: 'Traditional Sweet', price: 'Rs. 80', image: '/traditional_sweet.jpg', description: 'A delightful dessert made from local ingredients.' },
    ],
    2: [
      { id: 'ASH1', name: 'Spicy Andhra Chicken', price: 'Rs. 220', image: '/Spicy_andhra_chicken.jpg', description: 'A classic dish featuring marinated chicken cooked in a spicy, tangy sauce.' },
      { id: 'ASH2', name: 'Andhra Thali', price: 'Rs. 250', image: '/Andhra_thali.jpg', description: 'A lavish platter that showcases the diversity of Andhra cuisine.' },
      { id: 'ASH3', name: 'Vegetable Biryani', price: 'Rs. 180', image: '/Vegetable_biryani.jpg', description: 'Aromatic basmati rice cooked with a medley of fresh vegetables.' },
      { id: 'ASH4', name: 'Andhra Fish Fry', price: 'Rs. 210', image: '/Andhra_fish_fry.jpg', description: 'Fresh fish marinated in a spicy and tangy blend, then pan-fried to achieve a crispy texture.' },
      { id: 'ASH5', name: 'Andhra Special Roti', price: 'Rs. 90', image: '/Andhra_special_roti.jpg', description: 'Soft, handmade flatbreads perfect for scooping up curries.' },
    ],
    3: [
      { id: 'TT1', name: 'Telangana Chicken Biryani', price: 'Rs. 230', image: '/Telangana_chicken_biryani.jpg', description: 'A rich and aromatic biryani made with marinated meat, layered with fragrant basmati rice and slow-cooked to perfection.' },
      { id: 'TT2', name: 'Smoky Roti', price: 'Rs. 100', image: '/Smoky_roti.jpg', description: 'Soft, whole wheat flatbreads cooked on a traditional tandoor.' },
      { id: 'TT3', name: 'Telangana Mutton Pulao', price: 'Rs. 150', image: '/Telangana_mutton_pulao.jpg', description: 'A flavorful rice dish cooked with an assortment of spices and fresh mutton.' },
      { id: 'TT4', name: 'Charcoal Grilled Chicken', price: 'Rs. 250', image: '/Charcoal_grilled_chicken.jpg', description: 'Succulent chicken pieces marinated in a special blend of spices and grilled over charcoal for a smoky flavor.' },
      { id: 'TT5', name: 'Paneer Tikka', price: 'Rs. 180', image: '/Paneer_tikka.jpg', description: 'Marinated cubes of paneer (Indian cottage cheese) grilled to perfection.' },
    ],
    4: [
      { id: 'NK1', name: 'Nizam’s Biryani', price: 'Rs. 300', image: "/Nizam's_biryani.jpg", description: 'An exquisite biryani made with succulent meat, fragrant spices, and long-grain basmati rice.' },
      { id: 'NK2', name: 'Kebabs Platter', price: 'Rs. 350', image: '/Kebabs_platter.jpg', description: 'A selection of assorted kebabs, marinated and grilled to perfection.' },
      { id: 'NK3', name: 'Nizam’s Special Curry', price: 'Rs. 250', image: '/Nizams_special_curry.jpg', description: 'A rich and creamy curry featuring a blend of spices, meat, and traditional cooking techniques.' },
      { id: 'NK4', name: 'Biryani Pulao', price: 'Rs. 280', image: '/biryani_pulao.jpg', description: 'A delightful fusion of biryani and pulao.' },
      { id: 'NK5', name: 'Kheer (Dessert)', price: 'Rs. 100', image: '/kheer_dessert.jpg', description: 'A traditional Indian rice pudding made with milk, sugar, and flavored with cardamom.' },
    ],
    5: [
      { id: 'RV1', name: 'Rythu Special Thali', price: 'Rs. 270', image: '/rythu_thali.jpg', description: 'A wholesome thali showcasing the best of vegetarian dishes.' },
      { id: 'RV2', name: 'Vegetable Curry', price: 'Rs. 150', image: '/Vegetable_curry.jpg', description: 'A vibrant medley of seasonal vegetables cooked in a flavorful gravy.' },
      { id: 'RV3', name: 'Bitter Gourd Fry', price: 'Rs. 140', image: '/bitter_guard_fry.jpg', description: 'A crispy and flavorful dish made from sliced bitter gourd.' },
      { id: 'RV4', name: 'Dal Tadka', price: 'Rs. 120', image: '/dal_thadka.jpeg', description: 'Yellow lentils cooked with spices and topped with a tempering of garlic and cumin.' },
      { id: 'RV5', name: 'Mixed Vegetable Salad', price: 'Rs. 80', image: '/mixed_vegetable_salad.jpg', description: 'A refreshing salad made with fresh seasonal vegetables.' },
    ]
  };

  const [menuItems, setMenuItems] = useState(menuData[id] || []);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(''); // State to hold the added message
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  // State for new and edited menu item details
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    id: '',
    name: '',
    price: '',
    image: '',
    description: '',
  });
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const handleAddToCart = (item) => {
    const itemWithRestaurant = {
      ...item,
      restaurantName: restaurant.name,
    };

    setCart((prevCart) => {
      const itemInCart = prevCart.find((cartItem) => cartItem.id === itemWithRestaurant.id);

      if (itemInCart) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemWithRestaurant.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        const updatedCart = [...prevCart, { ...itemWithRestaurant, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        displayMessage(`${itemWithRestaurant.name} added to cart!`); // Show the message
        return updatedCart;
      }
    });
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(''); // Clear the message after 3 seconds
    }, 3000);
  };


  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open the add menu modal
  const handleAddMenuClick = () => {
    setNewMenuItem({ id: '', name: '', price: '', image: '', description: '' }); // Reset new item
    setIsAddMenuModalOpen(true);
  };

  // Close the add menu modal
  const handleCloseAddMenuModal = () => {
    setIsAddMenuModalOpen(false);
  };

  // Open the edit menu modal
  const handleEditMenuClick = (item) => {
    setSelectedMenuItem(item);
    setNewMenuItem({ ...item }); // Set the selected item for editing
    setIsEditMenuModalOpen(true);
  };

  // Close the edit menu modal
  const handleCloseEditMenuModal = () => {
    setIsEditMenuModalOpen(false);
  };

  // Handle input changes for adding and editing
  const handleMenuInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({ ...newMenuItem, [name]: value });
  };

  // Handle adding a new menu item
  const handleAddNewMenuItem = () => {
    const updatedMenuItems = [...menuItems, { ...newMenuItem, id: `${id}${menuItems.length + 1}` }]; // Create new ID
    // Save the updated menu items (this can be more sophisticated in a real app)
    setMenuItems(updatedMenuItems);
    setIsAddMenuModalOpen(false);
  };

  // Handle editing an existing menu item
  const handleEditMenuItem = () => {
    const updatedMenuItems = menuItems.map(item =>
      item.id === selectedMenuItem.id ? newMenuItem : item
    );
    setMenuItems(updatedMenuItems);
    setIsEditMenuModalOpen(false);
  };

  return (
    <>
      <Header cartCount={cart.length} showSearchBar={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className='header-div'>
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
              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
              <button onClick={() => handleEditMenuClick(item)}>Edit</button> {/* Edit button */} 
            </div>
          ))}
          <div className='add-menu-card'>
            <button className="add-menu-button" onClick={handleAddMenuClick}>
              + Add New Menu Item
            </button> {/* Button to add new menu item */}
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
            <input type="text" name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description" />
            <button onClick={handleAddNewMenuItem}>Add Menu Item</button>
            <button onClick={handleCloseAddMenuModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for editing a menu item */}
      {isEditMenuModalOpen && (
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
            <input type="text" name="description" value={newMenuItem.description} onChange={handleMenuInputChange} placeholder="Description" />
            <button onClick={handleEditMenuItem}>Save Changes</button>
            <button onClick={handleCloseEditMenuModal}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Menu;
