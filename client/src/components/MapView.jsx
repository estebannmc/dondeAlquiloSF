import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corregir problema de íconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ properties, onMapClick, onMarkerClick }) => {
  const santaFeCenter = [-31.6107, -60.6973];

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (onMapClick) onMapClick(e.latlng);
      },
    });
    return null;
  };

  return (
    <div className="map-view rounded-xl overflow-hidden shadow-lg border-4 border-white">
      <MapContainer center={santaFeCenter} zoom={13} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {properties.map((prop) => (
          <Marker 
            key={prop.id} 
            position={[prop.latitud, prop.longitud]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(prop);
              },
            }}
          >
            <Popup>
              <div className="p-1">
                <strong className="text-blue-600">{prop.direccion}</strong>
                <p className="text-xs text-gray-500">Haz clic para ver reseñas</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
