const { db } = require('../config/firebase');

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

    const { direccion, latitud, longitud } = req.body;

    if (!direccion || !latitud || !longitud) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateCoordinates(latitud, longitud)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    const docRef = await db.collection('properties').add({
      direccion: sanitize(direccion),
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      fecha_creacion: new Date(),
      creado_por: user.id
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
