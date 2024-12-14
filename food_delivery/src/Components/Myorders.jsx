import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyOrders.css';
import Footer from './Footer';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userDetails = localStorage.getItem('user')
  const parsedUser = JSON.parse(userDetails)
  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve user details from localStorage
      if (!user) {
        setError('User not logged in');
        setLoading(false);
        navigate('/login');
        return;
      }

      const isAdmin = user.role === 'admin';

      // Fetch orders based on user role
      let response;
      if (isAdmin) {
        // Admin fetches all orders
        response = await axios.get('http://localhost:5000/api/orders');
        console.log(response);
      } else {
        // User fetches only their orders
        response = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
      }

      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="MyOrders">
        {parsedUser.role === 'admin' ? 'Loading all orders...' : 'Loading your orders...'}
      </div>
    );
  }

  if (error) {
    return <div className="MyOrders-error">{error}</div>;
  }

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    alert('Logout Successfull.');
    navigate('/');
  };

  return (
    <>
      <Header onLogout={onLogout} user={localStorage.getItem('user')} token={localStorage.getItem('token')} />
      <div className="MyOrders">
      {parsedUser.role === 'admin' ? <h1>All Orders</h1> : <h1>My Orders</h1>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <h3>Order #{order._id}</h3>
                <p><strong>Restaurant:</strong> {order.restaurantId.name}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Total Price:</strong> ₹{order.totalAmount}</p>
                {/* Display User ID if Admin */}
                {parsedUser.role === 'admin' && (
                  <p><strong>User ID:</strong> {order.userId}</p>
                )}
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.menuItemId._id}>
                      {item.menuItemId.name} - {item.quantity} x ₹{item.menuItemId.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
