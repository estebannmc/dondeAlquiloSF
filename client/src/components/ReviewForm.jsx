import React, { useState } from 'react';

const ReviewForm = ({ propertyId, userId, onReviewSubmit }) => {
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [presionAgua, setPresionAgua] = useState(3);
  const [mueblesEstado, setMueblesEstado] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onReviewSubmit({
      usuario_id: userId,
      propiedad_id: propertyId,
      comentario,
      estrellas,
      presion_agua: presionAgua,
      muebles_estado: mueblesEstado
    });
    setComentario('');
    setMueblesEstado('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white mb-4">
      <h3 className="text-lg font-bold mb-3">Nueva Reseña</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Calificación General</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={estrellas}
            onChange={(e) => setEstrellas(e.target.value)}
          >
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Presión de Agua (1-5)</label>
          <input
            type="number" min="1" max="5"
            className="w-full border p-2 rounded mt-1"
            value={presionAgua}
            onChange={(e) => setPresionAgua(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700">Estado de los Muebles</label>
        <input
          type="text"
          className="w-full border p-2 rounded mt-1"
          placeholder="Ej: Buenos, deteriorados, faltantes..."
          value={mueblesEstado}
          onChange={(e) => setMueblesEstado(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Comentario Adicional</label>
        <textarea
          className="w-full border p-2 rounded mt-1"
          rows="3"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Cuenta tu experiencia..."
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
        Publicar Reseña
      </button>
    </form>
  );
};

export default ReviewForm;
