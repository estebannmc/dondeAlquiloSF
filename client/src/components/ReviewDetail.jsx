import React from 'react';

const ReviewDetail = ({ review, onClose }) => {
  const formatDate = (fecha) => {
    if (!fecha) return '';
    const seconds = fecha._seconds || fecha;
    return new Date(seconds * 1000).toLocaleDateString('es-AR');
  };

  const getYesNoLabel = (value) => {
    const labels = { 'si': 'Sí', 'no': 'No', 'nsnc': 'NS/NC' };
    return labels[value] || value;
  };

  const getMueblesLabel = (value) => {
    const labels = {
      'excelente': 'Excelente',
      'bueno': 'Bueno',
      'regular': 'Regular',
      'deteriorado': 'Deteriorado',
      'faltantes': 'Faltantes',
      'sin_muebles': 'Sin muebles',
      'nsnc': 'NS/NC'
    };
    return labels[value] || value;
  };

  return (
    <div className="p-6">
      <div className="mb-6 pb-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-500 text-2xl">
            {'★'.repeat(review.estrellas || 0)}
          </span>
          <span className="text-gray-400 text-sm">
            {formatDate(review.fecha)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Presión de Agua</h4>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} className={n <= (review.presion_agua || 0) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
              ))}
            </div>
            <span className="text-gray-600">({review.presion_agua || 0}/5)</span>
          </div>
        </div>

        {review.muebles_estado && (
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Estado de los Muebles</h4>
            <p className="text-gray-800">{getMueblesLabel(review.muebles_estado)}</p>
          </div>
        )}

        {(review.humedad || review.ruido_exterior || review.olores_cañerias || review.plagas) && (
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Condiciones del Inmueble</h4>
            <div className="space-y-2">
              {review.humedad && (
                <div className="flex justify-between">
                  <span className="text-gray-600">¿Tiene problemas de humedad?</span>
                  <span className={`font-medium ${review.humedad === 'si' ? 'text-red-600' : review.humedad === 'no' ? 'text-green-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.humedad)}
                  </span>
                </div>
              )}
              {review.ruido_exterior && (
                <div className="flex justify-between">
                  <span className="text-gray-600">¿Hay mucho ruido del exterior?</span>
                  <span className={`font-medium ${review.ruido_exterior === 'si' ? 'text-red-600' : review.ruido_exterior === 'no' ? 'text-green-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.ruido_exterior)}
                  </span>
                </div>
              )}
              {review.olores_cañerias && (
                <div className="flex justify-between">
                  <span className="text-gray-600">¿Hay olores de cañerías?</span>
                  <span className={`font-medium ${review.olores_cañerias === 'si' ? 'text-red-600' : review.olores_cañerias === 'no' ? 'text-green-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.olores_cañerias)}
                  </span>
                </div>
              )}
              {review.plagas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">¿Hay presencia de plagas?</span>
                  <span className={`font-medium ${review.plagas === 'si' ? 'text-red-600' : review.plagas === 'no' ? 'text-green-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.plagas)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {(review.revision_electricidad || review.revision_gas || review.revision_plomeria || review.revision_cloacas) && (
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Revisiones de Seguridad</h4>
            <div className="space-y-2">
              {review.revision_electricidad && (
                <div className="flex justify-between">
                  <span className="text-gray-600">⚡ Revisión de Electricidad</span>
                  <span className={`font-medium ${review.revision_electricidad === 'si' ? 'text-green-600' : review.revision_electricidad === 'no' ? 'text-red-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.revision_electricidad)} {review.revision_electricidad === 'si' ? '(mostrada)' : review.revision_electricidad === 'no' ? '(no mostrada)' : ''}
                  </span>
                </div>
              )}
              {review.revision_gas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">🔥 Revisión de Gas</span>
                  <span className={`font-medium ${review.revision_gas === 'si' ? 'text-green-600' : review.revision_gas === 'no' ? 'text-red-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.revision_gas)} {review.revision_gas === 'si' ? '(mostrada)' : review.revision_gas === 'no' ? '(no mostrada)' : ''}
                  </span>
                </div>
              )}
              {review.revision_plomeria && (
                <div className="flex justify-between">
                  <span className="text-gray-600">💧 Revisión de Plomería</span>
                  <span className={`font-medium ${review.revision_plomeria === 'si' ? 'text-green-600' : review.revision_plomeria === 'no' ? 'text-red-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.revision_plomeria)} {review.revision_plomeria === 'si' ? '(mostrada)' : review.revision_plomeria === 'no' ? '(no mostrada)' : ''}
                  </span>
                </div>
              )}
              {review.revision_cloacas && (
                <div className="flex justify-between">
                  <span className="text-gray-600">🚽 Revisión de Cloacas</span>
                  <span className={`font-medium ${review.revision_cloacas === 'si' ? 'text-green-600' : review.revision_cloacas === 'no' ? 'text-red-600' : 'text-gray-500'}`}>
                    {getYesNoLabel(review.revision_cloacas)} {review.revision_cloacas === 'si' ? '(mostrada)' : review.revision_cloacas === 'no' ? '(no mostrada)' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {review.comentario && (
          <div>
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Comentario</h4>
            <p className="text-gray-800 italic leading-relaxed">{review.comentario}</p>
          </div>
        )}
      </div>

      <button 
        onClick={onClose}
        className="w-full mt-8 bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition"
      >
        Cerrar
      </button>
    </div>
  );
};

export default ReviewDetail;
