import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MapView from '../components/MapView';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { logCustomEvent } from '../firebase';

const Home = ({ user }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchReviews = async (propertyId) => {
    try {
      const response = await api.get(`/reviews/${propertyId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleMapClick = async (latlng) => {
    if (!user) {
      alert("Debes iniciar sesión para registrar una propiedad.");
      window.location.href = "/login";
      return;
    }
    const direccion = prompt("Ingrese la dirección para esta nueva propiedad:");
    if (direccion) {
      try {
        await api.post('/properties', {
          direccion,
          latitud: latlng.lat,
          longitud: latlng.lng
        });
        
        logCustomEvent('create_property', { 
          direccion: direccion,
          user_id: user?.id 
        });

        fetchProperties();
      } catch (error) {
        console.error("Error creating property:", error);
      }
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await api.post('/reviews', reviewData);
      
      logCustomEvent('submit_review', { 
        property_id: reviewData.propiedad_id,
        stars: reviewData.estrellas,
        user_id: user?.id 
      });

      fetchReviews(reviewData.propiedad_id);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    fetchReviews(property.id);
    
    logCustomEvent('view_property', { 
      property_id: property.id,
      direccion: property.direccion 
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="responsive-container">
        <header className="py-6 flex justify-between items-center bg-white px-6 rounded-b-xl shadow-sm mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🏠</span>
            <h1 className="text-3xl font-bold text-blue-700 tracking-tight">dondeAlquiloSF</h1>
          </div>
          <nav className="flex items-center space-x-6">
            {!user ? (
              <a href="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition">Iniciar Sesión</a>
            ) : (
              <a href="/profile" className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border hover:bg-white transition">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold">
                  {user.nombre.charAt(0)}
                </span>
                <span className="text-gray-700 font-medium">{user.nombre}</span>
              </a>
            )}
          </nav>
        </header>
        
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200">
              <MapView properties={properties} onMapClick={handleMapClick} onMarkerClick={handleMarkerClick} />
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> ¿Encontraste un alquiler? Haz clic en el mapa para registrar la dirección y deja tu reseña para ayudar a otros.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
              {selectedProperty ? (
                <div className="animate-fade-in">
                  <div className="mb-6 pb-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.direccion}</h2>
                    <p className="text-gray-500 text-sm">Santa Fe, Argentina</p>
                  </div>
                  
                  {user ? (
                    <ReviewForm 
                      propertyId={selectedProperty.id} 
                      userId={user.id} 
                      onReviewSubmit={handleReviewSubmit} 
                    />
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-center">
                      <p className="text-yellow-700 text-sm mb-3">Inicia sesión para dejar una reseña sobre esta propiedad.</p>
                      <a href="/login" className="text-blue-600 font-bold text-sm hover:underline">Ir a Login →</a>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <ReviewList reviews={reviews} />
                  </div>
                  
                  <button 
                    onClick={() => setSelectedProperty(null)}
                    className="w-full mt-6 py-2 text-sm font-medium text-gray-400 hover:text-red-500 transition border-t pt-4"
                  >
                    ← Volver a la exploración
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="text-5xl opacity-20">📍</div>
                  <h3 className="text-xl font-semibold text-gray-700">Explora Santa Fe</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Haz clic en un marcador para ver experiencias reales de inquilinos o registra una nueva ubicación haciendo clic en el mapa.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
