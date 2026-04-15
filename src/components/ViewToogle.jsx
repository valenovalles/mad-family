import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación

const ViewToggle = ({ vista }) => {
  const navigate = useNavigate(); // 2. Inicializamos el navegador

  return (
    <div className="view-toggle-container" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      padding: '10px 0',
      backgroundColor: 'var(--color-main-pink)'
    }}>
      <button 
        // 3. Cambiamos la URL a /lista
        onClick={() => navigate('/lista')}
        className={`btn-toggle ${vista === 'lista' ? 'active' : 'inactive'}`}
        style={{
          opacity: vista === 'lista' ? 1 : 0.5, // Brilla si es la ruta activa
          transition: 'all 0.3s ease',
          fontWeight: '900',
          // Asegúrate de que tus estilos CSS para .active y .inactive sigan funcionando
        }}
      >
        Lista
      </button>

      <button 
        // 4. Cambiamos la URL a /mapa
        onClick={() => navigate('/mapa')}
        className={`btn-toggle ${vista === 'mapa' ? 'active' : 'inactive'}`}
        style={{
          opacity: vista === 'mapa' ? 1 : 0.5, // Brilla si es la ruta activa
          transition: 'all 0.3s ease',
          fontWeight: '900'
        }}
      >
        Mapa
      </button>
    </div>
  );
};

export default ViewToggle;