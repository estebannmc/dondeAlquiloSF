import React from 'react';
import MessageInbox from '../components/MessageInbox';

const Profile = ({ user }) => {
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/auth/logout`, {
        credentials: 'include'
      });
      window.location.href = '/';
    } catch (error) {
      window.location.href = '/';
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  const initial = user.nombre ? user.nombre.charAt(0).toUpperCase() : '?';

  return (
    <div className="bg-white min-h-screen">
      <div className="responsive-container">
        <header className="py-8 flex justify-between items-center">
          <div>
            <a href="/" className="text-primary-500 font-medium hover:underline flex items-center mb-2">
              <span className="mr-1">←</span> Volver al Mapa
            </a>
            <h1 className="text-4xl font-extrabold text-gray-900">Mi Perfil</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-xl font-bold hover:bg-red-50 transition shadow-sm"
          >
            Cerrar Sesión
          </button>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-primary-500 text-white text-4xl flex items-center justify-center rounded-full font-bold mx-auto mb-4 shadow-lg">
                {initial}
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{user.nombre || 'Usuario'}</h2>
              <p className="text-gray-500 mb-6">{user.email || 'Sin email'}</p>
              
              <div className="pt-6 border-t text-left space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Proveedor</p>
                  <p className="text-gray-700 capitalize">{user.proveedor_login || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <MessageInbox userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
