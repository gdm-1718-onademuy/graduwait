import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from './pages/auth/Login.js';
import Welcome from './pages/auth/Welcome.js';
import Register from './pages/auth/Register.js';
import Location from './pages/auth/Location.js';
import Extra from './pages/auth/Extra.js';
import UserProfile from './pages/auth/UserProfile.js';
import Forgot from './pages/auth/Forgot.js';

import Dashboard from './pages/Client/pages/Dashboard.js';
import MyAgenda from './pages/Client/pages/MyAgenda.js';
import Info from './pages/Client/pages/Info.js';
import Payment from './pages/Client/pages/Payment.js';
import PaymentSuccessful from './pages/Client/pages/PaymentSuccessful.js';
import Match from './pages/Client/pages/Match.js';

// https://reactrouter.com/docs/en/v6/getting-started/tutorial
// https://reactrouter.com/docs/en/v6/getting-started/overview
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/location" element={<Location />} />
        <Route path="/extra" element={<Extra />} />
        <Route path="/profile" element={< UserProfile />} />
        <Route path="/forgot" element={< Forgot />} />


        <Route path="/dashboard" element={<Dashboard />} />
        <Route exact path="/agenda/:id" element={<MyAgenda/>} />
        <Route exact path="/myagenda" element={<MyAgenda />} />
        <Route path="/info" element={<Info />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/PaymentSuccessful" element={<PaymentSuccessful />} />
        <Route path="/match" element={<Match />} />

        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
