const { db } = require('../config/firebase');

exports.getProperties = async (req, res) => {
  try {
    const snapshot = await db.collection('properties').get();
    const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const { direccion, latitud, longitud } = req.body;
    const docRef = await db.collection('properties').add({
      direccion,
      latitud: parseFloat(latitud),
      longitud: parseFloat(longitud),
      fecha_creacion: new Date()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
