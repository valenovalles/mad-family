const CategoryFilters = ({ filtroCat, setFiltroCat }) => {
  const categorias = [
    { id: 'todos', nombre: 'Todos', icono: 'auto_awesome', color: 'var(--color-all)' },
    { id: 'restaurante', nombre: 'Comer', icono: 'restaurant', color: 'var(--cat-restaurante)' },
    { id: 'parque', nombre: 'Parques', icono: 'park', color: 'var(--cat-parque)' },
    { id: 'ocio', nombre: 'Ocio', icono: 'attractions', color: 'var(--cat-ocio)' },
    { id: 'cultura', nombre: 'Cultura', icono: 'palette', color: 'var(--cat-cultura)' },
  ];

  return (
    <div style={{ 
      padding: '12px 20px', 
      display: 'flex', 
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px', 
      backgroundColor: 'var(--color-main-pink)',
    }}>
      {categorias.map(cat => {
        const isActive = filtroCat === cat.id;
        return (
          <button 
            key={cat.id}
            onClick={() => setFiltroCat(cat.id)}
            style={{
              padding: '8px 16px',
              // AQUÍ ESTÁ EL TRUCO: Usamos tu variable de radio circular
              borderRadius: 'var(--radius-pill)', 
              backgroundColor: isActive ? cat.color : 'var(--color-white)',
              color: isActive ? 'white' : cat.color,
              border: `2px solid ${cat.color}`,
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>
              {cat.icono}
            </span>
            {cat.nombre}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilters;