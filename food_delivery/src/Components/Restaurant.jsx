import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './Restaurant.css';

const Restaurant = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    description: '',
    image: '',
    location: '',
    timings: { openingTime: '', closingTime: '' },
    rating: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const restaurantsResponse = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurantList(restaurantsResponse.data);
      } catch (err) {
        setError('Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }

    fetchRestaurants();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setUser(null);
    alert('Logout Successful.');
    navigate('/');
  };

  const handleViewMenu = (restaurant) => {
    setSelectedRestaurant(restaurant);
    navigate(`/restaurant/${restaurant._id}`, { state: restaurant });
  };

  const handleAddRestaurantClick = () => {
    setIsAddRestaurantModalOpen(true);
  };

  const handleCloseAddRestaurantModal = () => {
    setIsAddRestaurantModalOpen(false);
  };

  const handleEditRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith('timings.')) {
      const field = name.split('.')[1]; // Extract "openingTime" or "closingTime"
      if (isEditModalOpen) {
        setSelectedRestaurant({
          ...selectedRestaurant,
          timings: {
            ...selectedRestaurant.timings,
            [field]: value,
          },
        });
      } else {
        setNewRestaurant({
          ...newRestaurant,
          timings: {
            ...newRestaurant.timings,
            [field]: value,
          },
        });
      }
    } else {
      if (isEditModalOpen) {
        setSelectedRestaurant({ ...selectedRestaurant, [name]: value });
      } else {
        setNewRestaurant({ ...newRestaurant, [name]: value });
      }
    }
  };
  

  const handleAddNewRestaurant = async () => {
    try {
      await axios.post('http://localhost:5000/api/restaurants', newRestaurant);
      setRestaurantList([...restaurantList, newRestaurant]);
      setIsAddRestaurantModalOpen(false);
      alert('Restaurant added successfully.');
    } catch (err) {
      setError('Failed to add restaurant');
    }
  };

  const handleEditRestaurant = async () => {
    try {
      await axios.put(`http://localhost:5000/api/restaurants/${selectedRestaurant._id}`, selectedRestaurant);
      const updatedRestaurants = restaurantList.map((rest) =>
        rest._id === selectedRestaurant._id ? { ...rest, ...selectedRestaurant } : rest
      );

      setRestaurantList(updatedRestaurants);
      setIsEditModalOpen(false);
      alert('Restaurant updated successfully.');
    } catch (err) {
      setError('Failed to update restaurant');
    }
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(`http://localhost:5000/api/restaurants/${restaurantId}`);
      setRestaurantList(restaurantList.filter((restaurant) => restaurant._id !== restaurantId));
      alert('Restaurant and its menu deleted successfully.');
    } catch (err) {
      setError('Failed to delete restaurant');
    }
  };

  const filteredRestaurants = restaurantList.filter((restaurant) =>
    restaurant.name && restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlecartCount = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${user._id}`);

      const cartData = response.data;
      const itemCount = cartData.length;
      return itemCount;
    } catch (err) {
      setError('Failed to get cart data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header
        cartCount={handlecartCount}
        onLogout={onLogout}
        user={user}
        showSearchBar={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="restaurant-list">
        {filteredRestaurants.map((restaurant) => (
          <div key={restaurant._id} className="card">
            <img src={restaurant.image} alt={restaurant.name} className="image" />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p>Timings : {restaurant.timings.openingTime} - {restaurant.timings.closingTime}</p>
            <p>Rating: {restaurant.rating}</p>
            <button onClick={() => handleViewMenu(restaurant)}>View Menu</button>
            {user?.role === 'admin' && (
              <>
                <button onClick={() => handleEditRestaurantClick(restaurant)}>Edit</button>
                <button onClick={() => handleDeleteRestaurant(restaurant._id)}>Delete</button>
              </>
            )}
          </div>
        ))}

        {user?.role === 'admin' && (
          <div className="add-restaurant-card">
            <button className="add-restaurant-button" onClick={handleAddRestaurantClick}>
              + Add New Restaurant
            </button>
          </div>
        )}
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
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={newRestaurant.location}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <label>Opening Time:</label>
            <input
              type="text"
              name="timings.openingTime"
              value={newRestaurant.timings.openingTime}
              onChange={handleInputChange}
              placeholder="Opening Time (e.g., 9:00 AM)"
            />
            <label>Closing Time:</label>
            <input
              type="text"
              name="timings.closingTime"
              value={newRestaurant.timings.closingTime}
              onChange={handleInputChange}
              placeholder="Closing Time (e.g., 10:00 PM)"
            />
            <label>Rating:</label>
            <input
              type="number"
              name="rating"
              value={newRestaurant.rating}
              onChange={handleInputChange}
              placeholder="Rating (0-5)"
              min="0"
              max="5"
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
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={selectedRestaurant?.location || ''}
              onChange={handleInputChange}
              placeholder="Location"
            />
            <label>Opening Time:</label>
            <input
              type="text"
              name="timings.openingTime"
              value={selectedRestaurant?.timings?.openingTime || ''}
              onChange={handleInputChange}
              placeholder="Opening Time (e.g., 9:00 AM)"
            />
            <label>Closing Time:</label>
            <input
              type="text"
              name="timings.closingTime"
              value={selectedRestaurant?.timings?.closingTime || ''}
              onChange={handleInputChange}
              placeholder="Closing Time (e.g., 10:00 PM)"
            />
            <label>Rating:</label>
            <input
              type="number"
              name="rating"
              value={selectedRestaurant?.rating || 0}
              onChange={handleInputChange}
              placeholder="Rating (0-5)"
              min="0"
              max="5"
            />
            <button onClick={handleEditRestaurant}>Update Restaurant</button>
            <button onClick={handleCloseEditModal}>Close</button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Restaurant;
