import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceCard from './PlaceCard';

const Favoritos = ({ favoritos, places, toggleFavorito }) => {
  const navigate = useNavigate();

  // Aseguramos la comparación transformando todo a Number por si Supabase o el JSON difieren en tipos
  const misFavoritos = places.filter(p => 
    favoritos.map(Number).includes(Number(p.id))
  );

  return (
    <div style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <h2 style={{ color: 'var(--color-main-pink)', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>
        Mis Planes Favoritos ❤️✨
      </h2>
      
      {misFavoritos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px', 
          backgroundColor: 'white', 
          padding: '40px 20px', 
          borderRadius: '35px', 
          boxShadow: 'var(--shadow-soft)',
          maxWidth: '400px',
          margin: '60px auto 0'
        }}>
          <span className="material-symbols-rounded" style={{ fontSize: '3.5rem', color: 'var(--color-main-blue)', marginBottom: '15px' }}>
            map
          </span>
          <p style={{ color: 'var(--color-text)', fontWeight: '800', fontSize: '1.1rem', margin: '0 0 10px 0' }}>
            ¡Tu lista está vacía, family!
          </p>
          <p style={{ color: '#777', fontSize: '0.9rem', lineHeight: '1.4', margin: '0 0 25px 0' }}>
            Aún no has guardado ningún planazo. Explora el mapa para descubrir los mejores sitios con los peques.
          </p>
          <button
            onClick={() => navigate('/mapa')}
            style={{
              backgroundColor: 'var(--color-main-blue)',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '16px',
              fontWeight: '900',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 0 rgba(0,0,0,0.05)'
            }}
          >
            Ver mapa de planes 🚀
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '25px', 
          justifyItems: 'center' 
        }}>
          {misFavoritos.map(sitio => (
            <PlaceCard 
              key={sitio.id} 
              sitio={sitio} 
              isFav={true} 
              onToggleFav={() => toggleFavorito(sitio.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;