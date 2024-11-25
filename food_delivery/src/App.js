import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Homepage from './Components/Homepage';
import ContactUs from './ContactUs';
import Restaurant from './Components/Restaurant';
import Menu from './Components/Menu';
import Cart from './Components/Cart';
import Checkout from './Components/Checkout';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import InitialPage from './Components/initialPage';
import UserHome from './Components/userHomePage';
import AdminHome from './Components/adminHomePage';
import Register from './Components/Register';
import Login from './Components/Login';


const App = () => {
  return (
    <BrowserRouter>
      {/* <Router> */}
      <Routes>
        <Route path='/' element={<InitialPage />} />
        <Route path='/user' element = {<UserHome />} />
        <Route path='/admin' element = {<AdminHome />} />
        <Route path='/restaurants' element={<Restaurant />} />
        <Route path='/about' element={<Homepage />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/privacy' element={<PrivacyPolicy/>} />
        <Route path='/terms' element={<TermsOfService/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/admin/login' element={<Login/>} />
        <Route path='/register' element={<Register />} />
        <Route path='/admin/register' element = {<Register />} />
        <Route path="/restaurant/:id" element={<Menu Restaurant={Restaurant}/>} />
        <Route path="/cart" element={<Cart />} /> {/* Add the cart route */}
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
      {/* </Router> */}
    </BrowserRouter>
  );
}

export default App;
