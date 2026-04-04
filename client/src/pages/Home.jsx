import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import MapView from '../components/MapView';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import ReviewDetail from '../components/ReviewDetail';
import { logCustomEvent } from '../firebase';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [propertyForReview, setPropertyForReview] = useState(null);
  const [latestReviews, setLatestReviews] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProperties();
    fetchLatestReviews();
  }, []);

  const fetchLatestReviews = async () => {
    try {
      const response = await api.get('/reviews/latest');
      setLatestReviews(response.data);
    } catch (error) {
      console.error("Error fetching latest reviews:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchReviews = useCallback(async (propertyId) => {
    try {
      const response = await api.get(`/reviews/${propertyId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

  const handleMapClick = async (latlng) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await api.post('/properties', {
        latitud: latlng.lat,
        longitud: latlng.lng
      });

      const newProperty = {
        id: response.data.id,
        direccion: response.data.direccion,
        latitud: response.data.latitud,
        longitud: response.data.longitud
      };

      setProperties(prev => [...prev, newProperty]);
      setSelectedProperty(newProperty);
      setReviews([]);

      logCustomEvent('create_property', {
        direccion: response.data.direccion,
        user_id: user?.id
      });

      alert('¡Propiedad creada exitosamente!');
    } catch (error) {
      console.error("Error creating property:", error);
      const errorMessage = error.response?.data?.error || error.message;
      alert(errorMessage);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      console.log('Enviando reseña:', reviewData);
      const response = await api.post('/reviews', reviewData);
      console.log('Reseña creada:', response.data);
      
      logCustomEvent('submit_review', { 
        property_id: reviewData.propiedad_id,
        stars: reviewData.estrellas,
        user_id: user?.id 
      });

      alert('¡Reseña publicada exitosamente!');
      setShowReviewModal(false);
      setPropertyForReview(null);
      
      setTimeout(() => {
        fetchReviews(reviewData.propiedad_id);
      }, 500);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert('Error al publicar la reseña: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleMarkerClick = useCallback((property) => {
    setSelectedProperty(property);
    fetchReviews(property.id);
    
    logCustomEvent('view_property', { 
      property_id: property.id,
      direccion: property.direccion 
    });
  }, [fetchReviews]);

  const openReviewModal = (property) => {
    setPropertyForReview(property);
    setShowReviewModal(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="responsive-container">
        <header className="py-5 flex justify-between items-center bg-light shadow-sm mb-12">
          <div className="flex-1"></div>
          <h1 className="text-2xl font-semibold text-primary-700 tracking-wide">
            ¿Dónde Alquilo?
          </h1>
          <div className="flex-1 flex justify-end mr-3">
            {!user ? (
              <a href="/login" className="text-sm text-primary-500 hover:text-primary-700 font-medium transition">
                Iniciar Sesión
              </a>
            ) : (
              <a href="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-500 transition">
                <span className="w-6 h-6 bg-primary-100 text-primary-500 flex items-center justify-center rounded-full text-xs font-bold">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : '?'}
                </span>
                <span>{user.nombre || 'Usuario'}</span>
              </a>
            )}
          </div>
        </header>

        <section className="relative h-[450px] overflow-hidden mb-24">
            <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center transform scale-110 blur-md"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight">
                Descubrí la verdad de cada propiedad
              </h2>
              <p className="text-base md:text-lg text-white/90 max-w-2xl mb-6">
                Somos un espacio donde encontrarás información sobre el inmueble que estás por comprar o alquiler que <span className="font-bold text-amber-400">nunca te cuentan</span>.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="#mapa" className="bg-white text-primary-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg">
                  Explorar Reseñas
                </a>
                {!user && (
                  <a href="/login" className="bg-primary-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-600 transition shadow-lg">
                    Crear mi primera reseña
                  </a>
                )}
              </div>
            </div>
        </section>

        <section id="mapa" className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Explora propiedades en Santa Fe
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Ver reseñas reales de inquilinos y compartí tu experiencia
            </p>
          </div>
          
          {latestReviews.length > 0 && (
            <div className="pt-[30px] pb-[30px] px-6 md:px-8">
              <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
                Últimas reseñas añadidas por usuarios
              </h3>
              <div className="flex justify-center gap-4 overflow-hidden">
                {latestReviews.slice(currentSlide, currentSlide + 5).map((review) => (
                  <div key={review.id} className="min-w-[200px] max-w-[220px] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gray-200 relative">
                      {review.latitud && review.longitud ? (
                        <img 
                          src={`https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${review.latitud},${review.longitud}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&fov=90&heading=235&pitch=10`}
                          alt={review.direccion}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800 truncate">{review.direccion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {review.fecha ? (review.fecha._seconds ? new Date(review.fecha._seconds * 1000).toLocaleDateString('es-AR') : new Date(review.fecha).toLocaleDateString('es-AR')) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {latestReviews.length > 5 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(latestReviews.length / 5) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index * 5)}
                      className={`w-2 h-2 rounded-full ${currentSlide === index * 5 ? 'bg-primary-500' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 md:px-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-200 h-[400px]">
                <MapView properties={properties} onMapClick={handleMapClick} onMarkerClick={handleMarkerClick} />
              </div>
              <div className="bg-primary-50 border-l-4 border-primary-400 p-4 rounded-r-lg">
                <p className="text-primary-800 text-sm">
                  <strong>Tip:</strong> ¿Encontraste un alquiler? Haz clic en el mapa para registrar la dirección y deja tu reseña para ayudar a otros.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-4 h-[400px] overflow-y-auto custom-scrollbar">
                {selectedProperty ? (
                  <div className="animate-fade-in">
                    <div className="mb-6 pb-4 border-b">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedProperty.direccion}</h2>
                      <p className="text-gray-500 text-sm">Santa Fe, Argentina</p>
                    </div>

                    {reviews.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">Reseñas ({reviews.length})</h3>
                          {user && (
                            <button
                              onClick={() => openReviewModal(selectedProperty)}
                              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                            >
                              + Añadir reseña
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {showAllReviews ? (
                            <>
                              <button
                                onClick={() => setShowAllReviews(false)}
                                className="text-primary-500 text-sm font-medium hover:underline mb-3"
                              >
                                ← Volver a vista resumida
                              </button>
                              <ReviewList reviews={reviews} />
                            </>
                          ) : (
                            <>
                              {reviews.slice(0, 2).map((review) => (
                                <div 
                                  key={review.id} 
                                  className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                                  onClick={() => setSelectedReview(review)}
                                >
                                  <div className="flex items-center mb-2">
                                    <span className="text-yellow-500">
                                      {'★'.repeat(review.estrellas || 0)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm line-clamp-2">{review.comentario}</p>
                                </div>
                              ))}
                              {reviews.length > 2 && (
                                <button 
                                  onClick={() => setShowAllReviews(true)}
                                  className="text-primary-500 text-sm font-medium hover:underline"
                                >
                                  Ver las {reviews.length} reseñas →
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {reviews.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Aún no hay reseñas para esta propiedad.</p>
                        {user ? (
                          <button
                            onClick={() => openReviewModal(selectedProperty)}
                            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
                          >
                            Añadir primera reseña
                          </button>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl">
                            <p className="text-yellow-700 text-sm mb-3">Inicia sesión para dejar una reseña.</p>
                            <a href="/login" className="text-primary-500 font-bold text-sm hover:underline">Ir a Login →</a>
                          </div>
                        )}
                      </div>
                    )}

                    {!user && (
                      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 text-center">
                        <p className="text-yellow-700 text-sm mb-3">Inicia sesión para dejar una reseña sobre esta propiedad.</p>
                        <a href="/login" className="text-primary-500 font-bold text-sm hover:underline">Ir a Login →</a>
                      </div>
                    )}
                    
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
        </section>
      </div>

      {showReviewModal && propertyForReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Nueva Reseña</h3>
                <p className="text-gray-500 text-sm">{propertyForReview.direccion}</p>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setPropertyForReview(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ReviewForm 
                propertyId={propertyForReview.id} 
                onReviewSubmit={handleReviewSubmit} 
              />
            </div>
          </div>
        </div>
      )}

      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Reseña Completa</h3>
                <p className="text-gray-500 text-sm">{selectedProperty?.direccion}</p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <ReviewDetail review={selectedReview} onClose={() => setSelectedReview(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;