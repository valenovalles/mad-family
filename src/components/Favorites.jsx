import React from 'react';
import PlaceCard from './PlaceCard';

const Favoritos = ({ favoritos, places, toggleFavorito }) => {
  const misFavoritos = places.filter(p => favoritos.includes(p.id));

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--color-main-pink)', fontWeight: '900', marginBottom: '20px' }}>
        Mis Planes Favoritos ❤️
      </h2>
      
      {misFavoritos.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
          Aún no has guardado planes. ¡Explora el mapa!
        </p>
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