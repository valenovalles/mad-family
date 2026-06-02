import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlaceCard = ({ sitio, isFav, onToggleFav }) => {
  const [copiado, setCopiado] = useState(false); // Controls toast animation
  const navigate = useNavigate();

  const esVarianteA = sitio.id % 2 === 0;
  const colorBoton = esVarianteA ? 'var(--color-main-pink)' : 'var(--color-main-blue)';
  const colorTagsText = esVarianteA ? 'var(--color-main-blue)' : 'var(--color-main-pink)';
  const colorTagsBorder = esVarianteA ? 'var(--color-main-blue)' : 'var(--color-main-pink)';

  const handleShare = (e) => {
    e.stopPropagation();
    
    // Construimos la URL real de la ficha del lugar para compartir el sitio específico
    const urlFicha = `${window.location.origin}/lugar/${sitio.id}`;

    if (navigator.share) {
      navigator.share({
        title: `madFamily: ${sitio.nombre}`,
        text: `¡Mira este planazo en Madrid para ir con niños! 🎡`,
        url: urlFicha,
      });
    } else {
      navigator.clipboard.writeText(urlFicha);
      
      // Lanzamos la animación del Toast personalizado
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  return (
    <div className="place-card" style={{ 
      width: '100%', 
      position: 'relative',
      backgroundColor: 'white', 
      borderRadius: '20px', 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow-soft)',
      marginBottom: '10px'
    }}>
      
      {/* --- AVISO FLOTANTE DE COPIADO (TOAST) --- */}
      {copiado && (
        <div style={{
          position: 'absolute', top: '15px', left: '15px', right: '15px',
          backgroundColor: 'var(--color-text)', color: 'white',
          padding: '8px 12px', borderRadius: '12px', fontSize: '0.75rem',
          fontWeight: '800', textAlign: 'center', zIndex: '20',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          animation: 'fadeInOut 2.5s ease-in-out'
        }}>
          ¡Enlace copiado! Pégalo en WhatsApp 🚀
        </div>
      )}
      
      {/* --- BOTÓN FAVORITO (FLOTANTE) --- */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav();
        }}
        style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none', width: '36px', height: '36px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          transition: 'transform 0.2s'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.8)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span className="material-symbols-rounded" style={{ 
          fontSize: '1.4rem',
          color: isFav ? '#D83A7E' : '#CCC',
          fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" 
        }}>
          favorite
        </span>
      </button>

      {/* ☁️ IMAGEN RECOORTADA CON EFECTO NUBE SIMÉTRICO ☁️ */}
      <div className="img-container-cloud" style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
        <img 
          src={sitio.imagen} 
          alt={sitio.nombre} 
          className="img-full" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* 🎨 ONDA FESTONEADA EN SVG: Replica el estilo dulce y parejo de las nubes */}
        <svg 
          viewBox="0 0 100 12" 
          preserveAspectRatio="none" 
          style={{
            position: 'absolute',
            bottom: '-1px', // Evita cualquier micro-línea extraña de renderizado
            left: 0,
            width: '100%',
            height: '22px', // Altura del festón
            fill: 'white', // Corta la imagen simulando el fondo de la tarjeta
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <path d="M0,12 L100,12 L100,6 C95,6 92,0 87.5,0 C83,0 80,6 75,6 C70,6 67,0 62.5,0 C58,0 55,6 50,6 C45,6 42,0 37.5,0 C33,0 30,6 25,6 C20,6 17,0 12.5,0 C8,0 5,6 0,6 Z" />
        </svg>
      </div>

      <div style={{ padding: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: 'var(--color-text)', fontWeight: '900' }}>
          {sitio.nombre}
        </h3>
        
        {/* TAGS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
          {sitio.caracteristicas.map(tag => (
            <span key={tag} style={{
              backgroundColor: 'var(--color-white)',
              color: colorTagsText,
              border: `1px solid ${colorTagsBorder}`,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.65rem',
              fontWeight: '700',
              textTransform: 'lowercase' 
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* --- ACCIONES EN PARALELO (ROW LAYOUT) --- */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          
          {/* Botón Compartir */}
          <button 
            onClick={handleShare}
            style={{
              backgroundColor: '#F4F4F6',
              color: 'var(--color-text)',
              border: 'none',
              height: '40px',
              width: '44px',
              borderRadius: 'var(--radius-soft)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'background-color 0.2s, transform 0.1s',
              margin: '0'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EAEAEF'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F4F4F6'}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Compartir con otra family"
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              share
            </span>
          </button>

          {/* Botón Principal: Ver ficha */}
          <button style={{
            flex: 1,
            height: '40px',
            backgroundColor: colorBoton,
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-soft)',
            fontWeight: '900',
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 0 rgba(0,0,0,0.05)', 
            transition: 'transform 0.1s, opacity 0.2s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => navigate(`/lugar/${sitio.id}`)}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Ver ficha completa
          </button>

        </div>
      </div>

      {/* Estilos CSS inyectados */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}} />
    </div>
  );
};

export default PlaceCard;