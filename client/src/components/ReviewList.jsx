import React from 'react';

const ReviewList = ({ reviews }) => {
  return (
    <div className="review-list mt-4">
      <h3 className="text-xl font-bold mb-4">Reseñas ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Aún no hay reseñas para esta propiedad.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-item border-b py-3 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-yellow-500 text-lg">
                {'★'.repeat(review.estrellas)}{'☆'.repeat(5-review.estrellas)}
              </span>
              <span className="text-xs text-gray-400">
                {review.fecha && new Date(review.fecha._seconds * 1000).toLocaleDateString()}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div className="bg-blue-50 p-1 rounded">
                <span className="text-blue-700 font-bold">Agua:</span> {review.presion_agua}/5
              </div>
              <div className="bg-green-50 p-1 rounded">
                <span className="text-green-700 font-bold">Muebles:</span> {review.muebles_estado}
              </div>
            </div>
            
            <p className="text-gray-700 text-sm italic">"{review.comentario}"</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
