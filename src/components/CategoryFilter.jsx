import React from 'react';

const CategoryFilters = ({ filtroCat, setFiltroCat }) => {
  const categorias = [
    { id: 'todos', nombre: 'Todos', icono: 'auto_awesome', color: 'var(--color-all)' },
    { id: 'restaurante', nombre: 'Comer', icono: 'restaurant', color: 'var(--cat-restaurante)' },
    { id: 'parque', nombre: 'Parques', icono: 'park', color: 'var(--cat-parque)' },
    { id: 'ocio', nombre: 'Ocio', icono: 'attractions', color: 'var(--cat-ocio)' },
    { id: 'cultura', nombre: 'Cultura', icono: 'palette', color: 'var(--cat-cultura)' },
  ];

  return (
    <div 
      className="nav-categorias-list"
      style={{ 
        padding: '8px 15px', 
        display: 'flex', 
        gap: '8px', 
        backgroundColor: 'var(--color-main-pink)',
        // 📱 Permitimos dos filas en móvil alineadas al inicio
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
      }}
    >
      {categorias.map(cat => {
        const isActive = filtroCat === cat.id;
        return (
          <button 
            key={cat.id}
            onClick={() => setFiltroCat(cat.id)}
            style={{
              padding: '6px 12px', // Un pelín más compacto para que entren mejor
              borderRadius: 'var(--radius-pill)', 
              backgroundColor: isActive ? cat.color : 'var(--color-white)',
              color: isActive ? 'white' : cat.color,
              border: `2px solid ${cat.color}`,
              fontSize: '0.78rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 3px 6px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1rem' }}>
              {cat.icono}
            </span>
            {cat.nombre}
          </button>
        );
      })}

      <style dangerouslySetInnerHTML={{ __html: `
        /* 🖥️ En pantallas grandes los centramos de nuevo */
        @media (min-width: 768px) {
          .nav-categorias-list {
            justify-content: center !important;
          }
        }
      `}} />
    </div>
  );
};

export default CategoryFilters;