const { db } = require('../config/firebase');

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.query;
    const snapshot = await db.collection('messages')
      .where('destinatario_id', '==', userId)
      .orderBy('fecha', 'desc')
      .get();
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { remitente_id, destinatario_id, contenido } = req.body;
    const docRef = await db.collection('messages').add({
      remitente_id,
      destinatario_id,
      contenido,
      fecha: new Date()
    });
    
    // Emitir via socket.io
    if (req.io) {
      req.io.to(destinatario_id).emit('receive_message', {
        remitente_id,
        destinatario_id,
        contenido,
        fecha: { _seconds: Math.floor(Date.now() / 1000) }
      });
    }
    
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
