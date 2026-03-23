const { db } = require('../config/firebase');

exports.getReviewsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const snapshot = await db.collection('reviews')
      .where('propiedad_id', '==', propertyId)
      .orderBy('fecha', 'desc')
      .get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { usuario_id, propiedad_id, comentario, estrellas, presion_agua, muebles_estado } = req.body;
    const docRef = await db.collection('reviews').add({
      usuario_id,
      propiedad_id,
      comentario,
      estrellas: parseInt(estrellas),
      presion_agua: parseInt(presion_agua) || 0,
      muebles_estado: muebles_estado || 'N/A',
      fecha: new Date()
    });
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
