import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapaMadrid from './MapaMadrid'; 
import CategoryGrid from './GridCategory'; 
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
      
      {/* CABECERA */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 0 25px 0',
        gap: '12px'
      }}>
        <img 
          src={logoMF} 
          alt="Mad Family Logo" 
          style={{ 
            height: '100px', 
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
          }} 
        />
        
        {/* ☁️ PROPUESTA DE VALOR / CONCEPTO MAD FAMILY */}
        <p style={{
          margin: '0 0 5px 0',
          textAlign: "center",
          fontSize: '0.85rem',
          fontWeight: '800',
          color: 'var(--color-text)',
          letterSpacing: '1.5px',
          backgroundColor: '#FFF',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          La guía colaborativa de Madrid, hecha por y para familias exploradoras 🎡✨
        </p>

        <h2 style={{ 
          color: 'var(--color-main-pink)', 
          fontWeight: '900', 
          fontSize: '1.4rem',
          textAlign: 'center',
          margin: 0,
          lineHeight: '1.2'
        }}>
          ¡Hola! Hay <span style={{ color: 'var(--color-main-blue)' }}>{totalPlanes}</span> planes cerca de ti
        </h2>
      </div>

      {/* CONTENEDOR DEL MAPA MINI */}
      <div 
        style={{ 
          height: '220px', 
          borderRadius: '30px', 
          overflow: 'hidden', 
          boxShadow: 'var(--shadow-soft)',
          marginBottom: '25px',
          border: '4px solid white',
          position: 'relative'
        }}
      >
        {/* 🔥 CLAVE: Le pasamos la función onMarkerClick para que intercepte el clic del icono */}
        <MapaMadrid 
          places={places} 
          onMarkerClick={(id) => navigate(`/mapa?seleccionar=${id}`)} 
        />
        
        {/* BOTÓN FLOTANTE GENERAL */}
        <div 
          onClick={() => navigate('/mapa')}
          style={{
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            backgroundColor: 'var(--color-main-blue)',
            color: 'white',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: '900',
            zIndex: 1000,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          AMPLIAR MAPA 📍
        </div>
      </div>

      <p style={{ fontWeight: '800', color: 'var(--color-text)', marginBottom: '15px' }}>
        Explorar por categoría:
      </p>

      <CategoryGrid setFiltroCat={setFiltroCat} />
      
    </div>
  );
};

export default Home;