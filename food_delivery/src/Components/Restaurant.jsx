
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Restaurant.css';

const Restaurant = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false); // Modal control for adding a restaurant
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal control for editing a restaurant
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    image: '',
    rating: '',
  }); // State for new restaurant details
  const [searchQuery, setSearchQuery] = useState(''); // State for search input

  const [restaurantList, setRestaurantList] = useState([
    { id: 1, name: 'Rayalaseema Ruchulu', description: 'A celebration of the rich culinary heritage from Rayalaseema', image: 'Raayalaseema_ruchulu.jpg', rating: '4.5/5' },
    { id: 2, name: 'Andhra Spice House', description: 'Bringing the bold and spicy flavors of Andhra to your plate', image: 'Andhra_spice_house.jpg', rating: '4/5' },
    { id: 3, name: 'Telangana Tandoor', description: 'Experience the smoky flavors and traditional dishes of Telangana', image: 'Telangana_tandoor.jpg', rating: '3.8/5' },
    { id: 4, name: "Nizam's Kitchen", description: 'A tribute to the royal flavors and heritage of Telangana cuisine', image: "Nizam's_kitchen.jpg", rating: '4.8/5' },
    { id: 5, name: 'Rythu Vantalu', description: 'Farm-fresh dishes inspired by the traditional cooking of Telangana and Andhra', image: 'Food-BananaLeaf.jpg', rating: '4.1/5' },
  ]);

  const navigate = useNavigate();

  // Handle viewing the restaurant menu
  const handleViewMenu = (restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/${restaurant.id}`, { state: restaurant });
  };

  // Open the add restaurant modal
  const handleAddRestaurantClick = () => {
    setIsAddRestaurantModalOpen(true);
  };

  // Close the add restaurant modal
  const handleCloseAddRestaurantModal = () => {
    setIsAddRestaurantModalOpen(false);
  };

  // Open the edit modal
  const handleEditRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  // Close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  // Handle input changes for both adding and editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditModalOpen) {
      setSelectedRestaurant({ ...selectedRestaurant, [name]: value });
    } else {
      setNewRestaurant({ ...newRestaurant, [name]: value });
    }
  };

  // Handle adding a new restaurant
  const handleAddNewRestaurant = () => {
    const updatedRestaurantList = [...restaurantList, { ...newRestaurant, id: restaurantList.length + 1 }];
    setRestaurantList(updatedRestaurantList);
    setIsAddRestaurantModalOpen(false);
  };

  // Handle editing an existing restaurant
  const handleEditRestaurant = () => {
    const updatedRestaurants = restaurantList.map((rest) =>
      rest.id === selectedRestaurant.id ? selectedRestaurant : rest
    );
    setRestaurantList(updatedRestaurants);
    setIsEditModalOpen(false);
  };

  const filteredRestaurants = restaurantList.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
      <Header showSearchBar={true} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="restaurant-list">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant.id} className="card">
            <img src={restaurant.image} alt={restaurant.name} className="image" />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p>Rating: {restaurant.rating}</p>
            <button onClick={() => handleViewMenu(restaurant)}>View Menu</button>
            <button onClick={() => handleEditRestaurantClick(restaurant)}>Edit</button> {/* Edit Button */}
          </div>
        ))}

        {/* Add Restaurant Button */}
        <div className="add-restaurant-card">
          <button className="add-restaurant-button" onClick={handleAddRestaurantClick}>
            + Add New Restaurant
          </button>
        </div>
      </div>

      {/* Modal for adding a new restaurant */}
      {isAddRestaurantModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Restaurant</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleInputChange}
              placeholder="Restaurant Name"
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={newRestaurant.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={newRestaurant.image}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
            <label>Rating:</label>
            <input
              type="text"
              name="rating"
              value={newRestaurant.rating}
              onChange={handleInputChange}
              placeholder="Rating (e.g., 4.5/5)"
            />
            <button onClick={handleAddNewRestaurant}>Add Restaurant</button>
            <button onClick={handleCloseAddRestaurantModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal for editing a restaurant */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Restaurant</h2>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={selectedRestaurant?.name || ''}
              onChange={handleInputChange}
              placeholder="Restaurant Name"
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={selectedRestaurant?.description || ''}
              onChange={handleInputChange}
              placeholder="Description"
            />
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={selectedRestaurant?.image || ''}
              onChange={handleInputChange}
              placeholder="Image URL"
            />
            <label>Rating:</label>
            <input
              type="text"
              name="rating"
              value={selectedRestaurant?.rating || ''}
              onChange={handleInputChange}
              placeholder="Rating (e.g., 4.5/5)"
            />
            <button onClick={handleEditRestaurant}>Save Changes</button>
            <button onClick={handleCloseEditModal}>Close</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Restaurant;
