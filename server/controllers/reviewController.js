const { db } = require('../config/firebase');

const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .substring(0, 2000);
};

const validValues = ['si', 'no', 'nsnc', ''];

exports.getReviewsByProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const snapshot = await db.collection('reviews')
      .where('propiedad_id', '==', propertyId)
      .get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    reviews.sort((a, b) => {
      const dateA = a.fecha?.seconds || 0;
      const dateB = b.fecha?.seconds || 0;
      return dateB - dateA;
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const user = req.user || req.session?.user;
    console.log('User:', user);
    console.log('Body:', req.body);
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { 
      propiedad_id, 
      comentario, 
      estrellas, 
      presion_agua, 
      humedad, 
      ruido_exterior, 
      olores_cañerias, 
      plagas,
      revision_electricidad,
      revision_gas,
      revision_plomeria,
      revision_cloacas,
      muebles_estado 
    } = req.body;

    if (!propiedad_id || !comentario || estrellas === undefined) {
      console.log('Missing fields:', { propiedad_id: !!propiedad_id, comentario: !!comentario, estrellas });
      return res.status(400).json({ error: 'Missing required fields: propiedad_id, comentario, estrellas' });
    }

    if (comentario.length < 20) {
      console.log('Comment too short:', comentario.length);
      return res.status(400).json({ error: 'Comment must be at least 20 characters' });
    }

    const parsedEstrellas = parseInt(estrellas);
    if (isNaN(parsedEstrellas) || parsedEstrellas < 1 || parsedEstrellas > 5) {
      return res.status(400).json({ error: 'Stars must be between 1 and 5' });
    }

    const parsedPresionAgua = parseInt(presion_agua);
    if (isNaN(parsedPresionAgua) || parsedPresionAgua < 1 || parsedPresionAgua > 5) {
      return res.status(400).json({ error: 'Water pressure must be between 1 and 5' });
    }

    const existingReview = await db.collection('reviews')
      .where('usuario_id', '==', user.id)
      .where('propiedad_id', '==', propiedad_id)
      .limit(1)
      .get();

    if (!existingReview.empty) {
      return res.status(400).json({ error: 'You already reviewed this property' });
    }

    const reviewData = {
      usuario_id: user.id,
      propiedad_id,
      comentario: sanitize(comentario),
      estrellas: parsedEstrellas,
      presion_agua: parsedPresionAgua,
      humedad: validValues.includes(humedad) ? humedad : '',
      ruido_exterior: validValues.includes(ruido_exterior) ? ruido_exterior : '',
      olores_cañerias: validValues.includes(olores_cañerias) ? olores_cañerias : '',
      plagas: validValues.includes(plagas) ? plagas : '',
      revision_electricidad: validValues.includes(revision_electricidad) ? revision_electricidad : '',
      revision_gas: validValues.includes(revision_gas) ? revision_gas : '',
      revision_plomeria: validValues.includes(revision_plomeria) ? revision_plomeria : '',
      revision_cloacas: validValues.includes(revision_cloacas) ? revision_cloacas : '',
      muebles_estado: muebles_estado ? sanitize(muebles_estado).substring(0, 50) : '',
      fecha: new Date()
    };

    const docRef = await db.collection('reviews').add(reviewData);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
