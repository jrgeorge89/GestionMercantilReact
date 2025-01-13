
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import BusinessmanForm from './components/BusinessmanForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/businessman/create" element={<BusinessmanForm />} />
        <Route path="/businessman/update/:id" element={<BusinessmanForm />} />
      </Routes>
    </Router>
  );
}

export default App;
