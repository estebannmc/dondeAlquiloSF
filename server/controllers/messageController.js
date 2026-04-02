const { db } = require('../config/firebase');

const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, 1000);
};

exports.getMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const snapshot = await db.collection('messages')
      .where('destinatario_id', '==', req.user.id)
      .orderBy('fecha', 'desc')
      .limit(100)
      .get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { destinatario_id, contenido } = req.body;

    if (!destinatario_id || !contenido) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (contenido.length > 1000) {
      return res.status(400).json({ error: 'Message too long' });
    }

    const docRef = await db.collection('messages').add({
      remitente_id: req.user.id,
      destinatario_id,
      contenido: sanitize(contenido),
      fecha: new Date()
    });
    
    if (req.io) {
      req.io.to(destinatario_id).emit('receive_message', {
        id: docRef.id,
        remitente_id: req.user.id,
        destinatario_id,
        contenido: sanitize(contenido),
        fecha: { _seconds: Math.floor(Date.now() / 1000) }
      });
    }
    
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
