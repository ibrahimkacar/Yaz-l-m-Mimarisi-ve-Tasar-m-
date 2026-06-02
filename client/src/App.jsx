import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApiDocs from './pages/ApiDocs';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Load user session on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // Theme apply
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search user={user} token={token} />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            
            <Route 
              path="/login" 
              element={
                user ? (
                  user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              } 
            />

            {/* Adopter Dashboard Route Guard */}
            <Route 
              path="/dashboard" 
              element={
                user && user.role === 'user' ? (
                  <UserDashboard user={user} token={token} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            {/* Admin Dashboard Route Guard */}
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? (
                  <AdminDashboard user={user} token={token} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
