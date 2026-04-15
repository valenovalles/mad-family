import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapaMadrid from './MapaMadrid'; 
import CategoryGrid from './GridCategory'; // <-- Aquí están tus figuras intactas
import logoMF from '../assets/logo_def.png'; 

const Home = ({ setFiltroCat, places }) => {
  const navigate = useNavigate();
  const totalPlanes = places.length;

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'var(--color-bg-cream)', 
      minHeight: '100vh', 
      paddingBottom: '100px'
    }}>
      
      {/* CABECERA: Solo añadimos el logo sticker arriba */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0 30px 0',
        gap: '15px'
      }}>
        <img 
          src={logoMF} 
          alt="Mad Family Logo" 
          style={{ 
            height: '100px', 
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
          }} 
        />
        <h2 style={{ 
          color: 'var(--color-main-pink)', 
          fontWeight: '900', 
          fontSize: '1.4rem',
          textAlign: 'center',
          margin: 0
        }}>
          ¡Hola! Hay <span style={{ color: 'var(--color-main-blue)' }}>{totalPlanes}</span> planes cerca de ti
        </h2>
      </div>

      {/* TU MAPA ACTUAL */}
      <div 
        onClick={() => navigate('/mapa')}
        style={{ 
          height: '220px', 
          borderRadius: '30px', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '25px',
          border: '4px solid white',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <MapaMadrid places={places} />
        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: 'var(--color-main-blue)',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '900',
          zIndex: 1000
        }}>
          AMPLIAR MAPA 📍
        </div>
      </div>

      <p style={{ fontWeight: '800', color: 'var(--color-text)', marginBottom: '15px' }}>
        Explorar por categoría:
      </p>

      {/* TUS FIGURAS GEOMÉTRICAS: No se toca nada dentro de CategoryGrid */}
      <CategoryGrid setFiltroCat={setFiltroCat} />
      
    </div>
  );
};

export default Home;