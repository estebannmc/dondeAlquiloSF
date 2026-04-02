import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import api from './utils/api';
import { logCustomEvent } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/user');
        if (response.data.success) {
          setUser(response.data.user);
          logCustomEvent('login_success', { 
            method: response.data.user.proveedor_login,
            user_id: response.data.user.id 
          });
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
