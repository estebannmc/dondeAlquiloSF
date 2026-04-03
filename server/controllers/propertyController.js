const { db } = require('../config/firebase');
const axios = require('axios');

const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  return !isNaN(latitude) && !isNaN(longitude) &&
         latitude >= -90 && latitude <= 90 &&
         longitude >= -180 && longitude <= 180;
};

const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, 500);
};

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const reverseGeocode = async (lat, lng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=es`;

  try {
    const response = await axios.get(url, { timeout: 5000 });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const result = response.data.results[0];
      return result.formatted_address;
    }

    if (response.data.status === 'ZERO_RESULTS') {
      return null;
    }

    throw new Error(`Geocoding API error: ${response.data.status}`);
  } catch (error) {
    if (error.response) {
      throw new Error(`Geocoding API error: ${error.response.status}`);
    }
    throw error;
  }
};

const checkDuplicateProperty = async (lat, lng, radiusMeters = 50) => {
  const snapshot = await db.collection('properties').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const distance = haversineDistance(lat, lng, data.latitud, data.longitud);

    if (distance <= radiusMeters) {
      return {
        exists: true,
        property: { id: doc.id, ...data }
      };
    }
  }

  return { exists: false, property: null };
};

exports.getProperties = async (req, res) => {
  try {
    const snapshot = await db.collection('properties').get();
    const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const user = req.user || req.session?.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { latitud, longitud } = req.body;

    if (!latitud || !longitud) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }

    if (!validateCoordinates(latitud, longitud)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);

    const duplicateCheck = await checkDuplicateProperty(lat, lng);
    if (duplicateCheck.exists) {
      return res.status(409).json({
        error: 'Ya existe una propiedad en esta ubicación',
        existingProperty: duplicateCheck.property
      });
    }

    let direccion;
    try {
      direccion = await reverseGeocode(lat, lng);
    } catch (geocodeError) {
      console.error('Geocoding error:', geocodeError.message);
      direccion = null;
    }

    if (!direccion) {
      return res.status(400).json({
        error: 'No se pudo obtener la dirección para esta ubicación. Intenta en otra posición del mapa.'
      });
    }

    const docRef = await db.collection('properties').add({
      direccion: sanitize(direccion),
      latitud: lat,
      longitud: lng,
      fecha_creacion: new Date(),
      creado_por: user.id
    });

    res.status(201).json({
      id: docRef.id,
      direccion,
      latitud: lat,
      longitud: lng
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
