import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios'; // Import axios for making HTTP requests
import './Checkout.css';
import Header from './Header';
import Footer from './Footer';

const activeUser = localStorage.getItem('user');
const parsedUser = JSON.parse(activeUser);
// console.log(parsedUser);
// console.log(parsedUser.id);
const restaurantDetails = localStorage.getItem('restaurantDetails');
const parsedRestaurantDetails = JSON.parse(restaurantDetails);
// console.log(parsedRestaurantDetails);
// console.log(parsedRestaurantDetails._id);

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
    // Check if all shipping fields are filled
    if (Object.values(shippingInfo).some(field => !field)) {
      setShippingError('Please fill in all shipping information fields.');
      return; // Prevent proceeding to payment
    }

    // Prepare the order data with shipping details and items
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
      // Send POST request to create the order
      const response = await axios.post('http://localhost:5000/api/orders', orderData);

      if (response.status === 201) {
        alert('Your order has been created.');

        // Clear the cart and shipping details
        // localStorage.removeItem('cart');
        setCart([]);
        setShippingInfo({
          name: '',
          address: '',
          city: '',
          postalCode: '',
          phone: '',
        });
      }

      // Proceed to open payment modal
      setIsPaymentModalOpen(true);

    }catch (error) {
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

      // Send GET request to find latest order
      const response = await axios.get(`http://localhost:5000/api/orders/user/latest/${parsedUser.id}`);

      const OrderDetails = response.data;
      // console.log(OrderDetails);
      const OrderId = OrderDetails._id;
      // console.log(OrderId);
      const Amount = OrderDetails.totalAmount;
      // console.log(Amount);


      // Prepare the data that need to be stored in the database.
      const paymentData = {
        userId : parsedUser.id,
        orderId : OrderId,
        amount : Amount,
      }

      // Send POST request to create the payment 
      const paymentResponse = await axios.post('http://localhost:5000/api/payments',paymentData);

      if (paymentResponse.status === 201) {
        alert('Payment successful! Your order has been placed.');

        // Close the payment modal and navigate to the home page
        setIsPaymentModalOpen(false);
        navigate('/restaurants'); // Adjust the path to your home page
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
    alert('Logout Successfull.');
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
                {shippingError && <span className="error">{shippingError}</span>} {/* Display shipping error */}
                <button type="submit" className="checkout-button">
                  Continue to Payment
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Payment Information</h2>
            <form onSubmit={handlePaymentSubmit}>
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={handlePaymentChange}
                placeholder="Enter your card number"
                required
              />
              {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}

              <label>Card Holder Name:</label>
              <input
                type="text"
                name="cardHolder"
                value={paymentInfo.cardHolder}
                onChange={handlePaymentChange}
                placeholder="Enter card holder's name"
                required
              />
              {errors.cardHolder && <span className="error">{errors.cardHolder}</span>}

              <label>Expiry Date:</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentInfo.expiryDate}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
                required
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}

              <label>CVV:</label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                placeholder="CVV"
                required
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}

              <button type="submit" className="payment-submit">
                Submit Payment
              </button>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Checkout;
