import React from 'react';

const ReviewList = ({ reviews }) => {
  const formatDate = (fecha) => {
    if (!fecha) return '';
    const seconds = fecha._seconds || fecha;
    return new Date(seconds * 1000).toLocaleDateString('es-AR');
  };

  const YesNoBadge = ({ value }) => {
    if (!value) return null;
    const config = {
      'si': { bg: 'bg-green-100', text: 'text-green-700', label: 'Sí' },
      'no': { bg: 'bg-red-100', text: 'text-red-700', label: 'No' },
      'nsnc': { bg: 'bg-gray-100', text: 'text-gray-600', label: 'NS/NC' }
    };
    const { bg, text, label } = config[value] || config['nsnc'];
    return (
      <span className={`${bg} ${text} text-[10px] px-1.5 py-0.5 rounded font-medium`}>
        {label}
      </span>
    );
  };

  const ItemBadge = ({ label, value, color = 'blue' }) => {
    if (!value) return null;
    const colors = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      yellow: 'bg-yellow-50 text-yellow-700',
      red: 'bg-red-50 text-red-700',
      purple: 'bg-purple-50 text-purple-700',
      gray: 'bg-gray-50 text-gray-600'
    };
    return (
      <div className={`${colors[color]} p-1.5 rounded text-[10px]`}>
        <span className="font-bold">{label}:</span> {value}/5
      </div>
    );
  };

  return (
    <div className="review-list mt-4">
      <h3 className="text-xl font-bold mb-4">Reseñas ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Aún no hay reseñas para esta propiedad.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-item border-b py-4 last:border-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-semibold text-yellow-500 text-lg">
                  {'★'.repeat(review.estrellas || 0)}{'☆'.repeat(5 - (review.estrellas || 0))}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {formatDate(review.fecha)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5 text-xs mb-3">
              <ItemBadge label="Agua" value={review.presion_agua} color="blue" />
              {review.muebles_estado && (
                <div className="bg-green-50 text-green-700 p-1.5 rounded text-[10px]">
                  <span className="font-bold">Muebles:</span> {review.muebles_estado}
                </div>
              )}
            </div>

            {(review.humedad || review.ruido_exterior || review.olores_cañerias || review.plagas) && (
              <div className="mb-3">
                <p className="text-[10px] text-gray-500 font-semibold mb-1">CONDICIONES:</p>
                <div className="flex flex-wrap gap-1.5">
                  {review.humedad && (
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">
                      Humedad: <YesNoBadge value={review.humedad} />
                    </span>
                  )}
                  {review.ruido_exterior && (
                    <span className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">
                      Ruido: <YesNoBadge value={review.ruido_exterior} />
                    </span>
                  )}
                  {review.olores_cañerias && (
                    <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                      Olores: <YesNoBadge value={review.olores_cañerias} />
                    </span>
                  )}
                  {review.plagas && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                      Plagas: <YesNoBadge value={review.plagas} />
                    </span>
                  )}
                </div>
              </div>
            )}

            {(review.revision_electricidad || review.revision_gas || review.revision_plomeria || review.revision_cloacas) && (
              <div className="mb-3 bg-gray-50 p-2 rounded-lg">
                <p className="text-[10px] text-gray-500 font-semibold mb-1.5">REVISIONES MOSTRADAS:</p>
                <div className="flex flex-wrap gap-2">
                  {review.revision_electricidad && (
                    <span className="flex items-center gap-1 text-[10px]">
                      ⚡ Electricidad <YesNoBadge value={review.revision_electricidad} />
                    </span>
                  )}
                  {review.revision_gas && (
                    <span className="flex items-center gap-1 text-[10px]">
                      🔥 Gas <YesNoBadge value={review.revision_gas} />
                    </span>
                  )}
                  {review.revision_plomeria && (
                    <span className="flex items-center gap-1 text-[10px]">
                      💧 Plomería <YesNoBadge value={review.revision_plomeria} />
                    </span>
                  )}
                  {review.revision_cloacas && (
                    <span className="flex items-center gap-1 text-[10px]">
                      🚽 Cloacas <YesNoBadge value={review.revision_cloacas} />
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {review.comentario && (
              <p className="text-gray-700 text-sm italic bg-gray-50 p-2 rounded">{review.comentario}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
