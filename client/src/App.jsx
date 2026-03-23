import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          // Registrar evento de login exitoso
          logCustomEvent('login_success', { 
            method: response.data.user.proveedor_login,
            user_id: response.data.user.id 
          });
        }
      } catch (error) {
        console.error("Not authenticated");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
