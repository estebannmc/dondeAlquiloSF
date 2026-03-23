import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001');

const MessageInbox = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchMessages();
    
    socket.emit('join_room', userId);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [data, ...prev]);
      // Notificación simple
      if (Notification.permission === "granted") {
        new Notification("Nuevo mensaje en dondeAlquiloSF", { body: data.contenido });
      } else {
        alert(`Nuevo mensaje: ${data.contenido}`);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages?userId=${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-inner border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Bandeja de Entrada</h3>
        <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
          {messages.length} mensajes
        </span>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 italic">No tienes mensajes aún.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="flex flex-col">
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.remitente_id === userId ? 'self-end bg-blue-600 text-white rounded-tr-none' : 'self-start bg-white text-gray-800 border border-gray-200 rounded-tl-none'}`}>
                <p className="text-sm">{msg.contenido}</p>
                <div className={`text-[10px] mt-1 opacity-70 ${msg.remitente_id === userId ? 'text-right' : 'text-left'}`}>
                  {msg.fecha && new Date(msg.fecha._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <span className={`text-[10px] text-gray-400 mt-1 ${msg.remitente_id === userId ? 'self-end mr-1' : 'self-start ml-1'}`}>
                {msg.remitente_id === userId ? 'Tú' : `De: ${msg.remitente_id.substring(0, 8)}...`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageInbox;
