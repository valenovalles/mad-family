import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. Importamos los hooks

const SearchBar = ({ setBusqueda }) => {
  const navigate = useNavigate(); // 2. Inicializamos la navegación
  const location = useLocation(); // Para saber dónde estamos y cambiar el color si hace falta

  return (
    <div style={{ 
      backgroundColor: 'var(--color-main-pink)', 
      padding: '10px 15px', // Ajustamos un pelín el padding para que no sea gigante en móvil
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* EL BUSCADOR */}
      <div style={{ flex: 1 }}>
        <input 
          type="text" 
          placeholder="¿Qué buscamos hoy?" 
          className="search-input" 
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {/* ÁREA DE ACCIONES (Favoritos y Perfil) */}
      <div className="header-user-actions" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        
        {/* BOTÓN FAVORITOS -> Ahora navega */}
        <button 
          onClick={() => navigate('/favoritos')} // 3. Acción de ir a Favoritos
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <span className="material-symbols-rounded" style={{
            // Si estamos en la página de favoritos, el corazón se rellena
            fontVariationSettings: location.pathname === '/favoritos' ? "'FILL' 1" : "'FILL' 0"
          }}>
            favorite
          </span>
        </button>
        
        {/* CÍRCULO PERFIL -> Ahora navega */}
        <div 
          onClick={() => navigate('/perfil')} // 4. Acción de ir a Perfil
          style={{ 
            width: '35px', 
            height: '35px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-main-blue)',
            border: '2px solid white',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: location.pathname === '/perfil' ? '0 0 0 2px white' : 'none' // Efecto si estás en perfil
          }}
        >
          MF
        </div>
      </div>
    </div>
  );
};

export default SearchBar;