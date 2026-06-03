import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para saber si una ruta está activa
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-navbar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '65px',
      backgroundColor: 'var(--color-main-blue)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 2000,
      paddingBottom: 'env(safe-area-inset-bottom)' 
    }}>
      
      {/* 1. Botón Explorar (Mapa) */}
      <button 
        onClick={() => navigate('/mapa')}
        style={navButtonStyle(isActive('/mapa') || isActive('/lista'))}
      >
        <span className="material-symbols-rounded" style={{
          fontVariationSettings: (isActive('/mapa') || isActive('/lista')) ? "'FILL' 1" : "'FILL' 0"
        }}>
          explore
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>Explorar</span>
      </button>

      {/* 🚀 2. NUEVO BOTÓN: Chivar Plan (Colaborativo) */}
      <button 
        onClick={() => navigate('/sugerir-plan')} // Asegúrate de que esta sea la ruta de tu componente Form
        style={navButtonStyle(isActive('/sugerir-plan'))}
      >
        <span className="material-symbols-rounded" style={{
          fontVariationSettings: isActive('/sugerir-plan') ? "'FILL' 1" : "'FILL' 0"
        }}>
          add_comment
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>Chivar Plan</span>
      </button>

      {/* 3. Botón Favoritos */}
      <button 
        onClick={() => navigate('/favoritos')}
        style={navButtonStyle(isActive('/favoritos'))}
      >
        <span className="material-symbols-rounded" style={{
          fontVariationSettings: isActive('/favoritos') ? "'FILL' 1" : "'FILL' 0"
        }}>
          favorite
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>Favoritos</span>
      </button>

      {/* 4. Botón Perfil */}
      <button 
        onClick={() => navigate('/perfil')}
        style={navButtonStyle(isActive('/perfil'))}
      >
        <span className="material-symbols-rounded" style={{
          fontVariationSettings: isActive('/perfil') ? "'FILL' 1" : "'FILL' 0"
        }}>
          account_circle
        </span>
        <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>Perfil</span>
      </button>

    </nav>
  );
};

// Estilo dinámico para los botones de la Nav (Se mantiene intacto tu código original)
const navButtonStyle = (active) => ({
  background: 'none',
  border: 'none',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  opacity: active ? 1 : 0.6,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  transform: active ? 'scale(1.1)' : 'scale(1)',
  outline: 'none'
});

export default FooterNav;