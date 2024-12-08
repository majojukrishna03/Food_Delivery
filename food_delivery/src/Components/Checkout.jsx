import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for making HTTP requests
import './Checkout.css';
import Header from './Header';
import Footer from './Footer';

const activeUser = localStorage.getItem('user');
const parsedUser = JSON.parse(activeUser);
const restaurantDetails = localStorage.getItem('restaurantDetails');
const parsedRestaurantDetails = JSON.parse(restaurantDetails);

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [shippingError, setShippingError] = useState(''); // State for shipping validation error

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!parsedUser) {
      // If user is not logged in, redirect to the login page
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseInt(item.price.replace('Rs. ', ''), 10)
        : item.price; // Use item.price directly if it's already a number
  
      return total + (price * item.quantity);
    }, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
    // Clear the shipping error when the user starts typing
    if (shippingError) {
      setShippingError('');
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = '';
    switch (name) {
      case 'cardNumber':
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(value)) {
          errorMessage = 'Card number must be 16 digits.';
        }
        break;
      case 'cardHolder':
        const cardHolderRegex = /^[A-Za-z\s]+$/;
        if (!cardHolderRegex.test(value)) {
          errorMessage = 'Card holder name must contain only letters and spaces.';
        }
        break;
      case 'expiryDate':
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDateRegex.test(value)) {
          errorMessage = 'Expiry date must be in the format MM/YY.';
        } else {
          const [month, year] = value.split('/').map(num => parseInt(num, 10));
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear() % 100;

          if (year < currentYear) {
            errorMessage = 'Expiry year must be greater than the current year.';
          } else if (year === currentYear && month <= currentMonth) {
            errorMessage = 'Expiry date must be greater than the current month.';
          }
        }
        break;
      case 'cvv':
        const cvvRegex = /^\d{3}$/;
        if (!cvvRegex.test(value)) {
          errorMessage = 'CVV must be 3 digits.';
        }
        break;
      default:
        break;
    }
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(shippingInfo).some(field => !field)) {
      setShippingError('Please fill in all shipping information fields.');
      return;
    }

    const orderData = {
      userId: parsedUser.id, 
      restaurantId: parsedRestaurantDetails._id, 
      items: cart.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity,
        itemAmount: item.price * item.quantity,
      })),
      shippingAddress: `${shippingInfo.name}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.phone}`,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);

      if (response.status === 201) {
        alert('Your order has been created.');
      }

      setIsPaymentModalOpen(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while checking out your order. Please try again.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) {
      alert('Please fix the errors in the payment form.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/orders/user/latest/${parsedUser.id}`);
      const OrderDetails = response.data;
      const OrderId = OrderDetails._id;
      const Amount = OrderDetails.totalAmount;

      const paymentData = {
        userId : parsedUser.id,
        orderId : OrderId,
        amount : Amount,
      };

      const paymentResponse = await axios.post('http://localhost:5000/api/payments', paymentData);
      // console.log(paymentResponse)

      if (paymentResponse.status === 201) {
        alert('Payment successful! Your order has been placed.');
        localStorage.removeItem('cart');
        await axios.delete(`http://localhost:5000/api/cart/clear/${parsedUser.id}`);
        setCart([]);
        setIsPaymentModalOpen(false);
        navigate('/restaurants');
      } else {
        alert('There was an issue processing your order.');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('An error occurred while placing your order. Please try again.');
    }
  };

  const onLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    alert('Logout Successful.');
    navigate('/');
  };

  return (
    <>
      <Header onLogout={onLogout} user={localStorage.getItem('user')} cartCount={cart.length} />
      <div className='background'>
        <div className='checkout-container'>
          <h2>Checkout</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty. Please add items before checking out!</p>
          ) : (
            <>
              <div className="checkout-items">
                <h3>Your Items</h3>
                {cart.map(item => (
                  <div key={item._id} className="checkout-item">
                    <img src={item.image} alt={item.name} className="checkout-item-image" />
                    <div className="checkout-item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-total">
                <h3>Total: Rs. {calculateTotal()}</h3>
              </div>

              <form onSubmit={handleSubmit} className="checkout-form">
                <h3>Shipping Information</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="phone"
                  name='phone'
                  placeholder='Phone Number'
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingInfo.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={shippingInfo.postalCode}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Proceed to Payment</button>
                {shippingError && <p className="error-message">{shippingError}</p>}
              </form>

              {isPaymentModalOpen && (
                <div className="payment-modal">
                  <form onSubmit={handlePaymentSubmit}>
                    <h3>Payment Information</h3>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                    <input
                      type="text"
                      name="cardHolder"
                      placeholder="Card Holder Name"
                      value={paymentInfo.cardHolder}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.cardHolder && <p className="error-message">{errors.cardHolder}</p>}
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="Expiry Date (MM/YY)"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      required
                    />
                    {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                    <button type="submit">Submit Payment</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
