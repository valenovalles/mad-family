import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook

const CategoryGrid = ({ setFiltroCat }) => {
  const navigate = useNavigate(); // 2. Inicializamos la función

  const categorias = [
    { 
      id: 'restaurante', nombre: 'Comer', icono: 'restaurant', color: 'var(--cat-restaurante)',
      path: "M12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9z" 
    },
    { 
      id: 'parque', nombre: 'Parques', icono: 'park', color: 'var(--cat-parque)',
      path: "M12,2 A10,10 0 1,1 11.9,2z" 
    },
    { 
      id: 'ocio', nombre: 'Ocio', icono: 'attractions', color: 'var(--cat-ocio)',
      path: "M12 2C14 2 15 5 15 5C15 5 18 4 19 6C20 8 18 9 18 9C18 9 21 10 21 12C21 14 18 15 18 15C18 15 20 16 19 18C18 20 15 19 15 19C15 19 14 22 12 22C10 22 9 19 9 19C9 19 6 20 5 18C4 16 6 15 6 15C6 15 3 14 3 12C3 10 6 9 6 9C6 9 4 8 5 6C6 4 9 5 9 5C9 5 10 2 12 2Z" 
    },
    { 
      id: 'cultura', nombre: 'Cultura', icono: 'palette', color: 'var(--cat-cultura)',
      path: "M12,2 L22,12 L12,22 L2,12z" 
    },
  ];

  // 3. Función unificada para filtrar y navegar
  const manejarClick = (id) => {
    setFiltroCat(id);
    // Navegamos a la lista pasando la categoría como parámetro
    navigate(`/lista?categoria=${id}`); 
  };

  return (
    <div className="home-category-grid">
      {categorias.map(cat => (
        <div 
          key={cat.id}
          onClick={() => manejarClick(cat.id)} // 4. Usamos la nueva función
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        >
          {/* FORMA SVG */}
          <svg 
            viewBox="0 0 24 24" 
            style={{ 
              position: 'absolute', 
              top: 0, left: 0, width: '100%', height: '100%',
              filter: 'drop-shadow(0 8px 15px rgba(0,0,0,0.12))',
              zIndex: 1
            }}
          >
            <path d={cat.path} fill={cat.color} />
          </svg>

          {/* ICONO Y TEXTO */}
          <div style={{ 
            zIndex: 2, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            color: 'white',
            padding: '10px' 
          }}>
            <span className="material-symbols-rounded" style={{ 
              fontSize: 'min(9vw, 2.5rem)', 
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
              {cat.icono}
            </span>
            <span style={{ 
              fontWeight: '900', 
              fontSize: 'min(3.5vw, 0.9rem)', 
              marginTop: '5px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)' // Sombra extra para legibilidad
            }}>
              {cat.nombre}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryGrid;