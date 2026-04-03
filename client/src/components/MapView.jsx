import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: -31.6107,
  lng: -60.6973
};

const libraries = ['places'];

const MapView = ({ properties, onMapClick, onMarkerClick }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onMapClickHandler = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    if (onMapClick) {
      onMapClick({ lat, lng });
    }
  }, [onMapClick]);

  const onMarkerClickHandler = useCallback((property) => {
    setSelectedProperty(property);
    if (onMarkerClick) {
      onMarkerClick(property);
    }
  }, [onMarkerClick]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
        <p className="text-red-500">Error al cargar el mapa. Verifica tu API key de Google Maps.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-xl">
        <p className="text-gray-500">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className="map-view rounded-xl overflow-hidden shadow-lg border-4 border-white">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={onMapClickHandler}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {properties.map((prop) => (
          <Marker
            key={prop.id}
            position={{ lat: prop.latitud, lng: prop.longitud }}
            onClick={() => onMarkerClickHandler(prop)}
          />
        ))}
        
        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.latitud, lng: selectedProperty.longitud }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-1">
              <strong className="text-blue-600">{selectedProperty.direccion}</strong>
              <p className="text-xs text-gray-500">Haz clic para ver reseñas</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapView;
