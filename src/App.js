import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Pages/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Services from './Pages/Services';
import Signup from './Auth/Signup';
import Signin from './Auth/Signin';
import Admin from './Dashboard/Admin/AdminDashboard';
import Students from './Dashboard/Student/StudentDashboard ';
import Users from './Dashboard/User/Users'
import {UserProvider} from './Auth/UserContext';
import Chatbot from './Chatbot/Chatbot';

import { useState } from "react";


const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <UserProvider>
      
    <div>
      <Router>
      <Navbar onChatClick={() => setChatOpen(true)} />
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/students" element={<Students />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
    </UserProvider>
  )
}

export default App
