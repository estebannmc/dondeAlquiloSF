import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const handleDemoLogin = async () => {
    try {
      const response = await api.get('/auth/mock-login');
      if (response.data.success) {
        if (onLogin) onLogin(response.data.user);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-semibold mb-6 text-primary-700">¿Dónde Alquilo?</h1>
        <p className="text-gray-600 mb-8">Únete a la comunidad de reseñas de alquileres en Santa Fe.</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleDemoLogin}
            className="flex items-center justify-center w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Usuario Demo
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          <a 
            href={`${API_URL}/auth/google`}
            className="flex items-center justify-center w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Continuar con Google
          </a>
          
          <a 
            href={`${API_URL}/auth/microsoft`}
            className="flex items-center justify-center w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Continuar con Microsoft
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
