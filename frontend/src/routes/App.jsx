import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import FormUser from '../pages/FormUser.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormUser />} />
        <Route
          path="/admin"
          element={
            isLoggedIn ? (
              <Dashboard />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        {/* Redirect all other routes to / */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 