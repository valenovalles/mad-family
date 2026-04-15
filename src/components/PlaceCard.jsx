import React from 'react';

const PlaceCard = ({ sitio, isFav, onToggleFav }) => {
  const esVarianteA = sitio.id % 2 === 0;

  const colorBoton = esVarianteA ? 'var(--color-main-pink)' : 'var(--color-main-blue)';
  const colorTagsText = esVarianteA ? 'var(--color-main-blue)' : 'var(--color-main-pink)';
  const colorTagsBorder = esVarianteA ? 'var(--color-main-blue)' : 'var(--color-main-pink)';

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `madFamily: ${sitio.nombre}`,
        text: `¡Mira este planazo en Madrid para ir con niños! 🎡`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado! Pégalo en WhatsApp 🚀");
    }
  };

  return (
    <div className="place-card" style={{ 
      width: '100%', 
      position: 'relative',
      // --- ESTILOS DE TARJETA BLANCA ---
      backgroundColor: 'white', 
      borderRadius: '20px', 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow-soft)',
      marginBottom: '10px'
    }}>
      
      {/* --- BOTÓN FAVORITO (FLOTANTE) --- */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav();
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Un pelín traslúcido queda genial
          border: 'none',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
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

      {/* IMAGEN Y NUBE */}
      <div className="img-container-cloud">
        <img src={sitio.imagen} alt={sitio.nombre} className="img-full" />
        <div className="cloud-divider"></div>
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

        {/* ACCIONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={handleShare}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: colorBoton,
              border: 'none',
              padding: '8px 0 8px 12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: '800',
              transition: 'opacity 0.2s',
              margin: '0'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '1.1rem' }}>send</span>
            Enviar a otra family
          </button>

          <button style={{
            width: '100%',
            backgroundColor: colorBoton,
            color: 'var(--color-white)',
            border: 'none',
            padding: '10px',
            borderRadius: 'var(--radius-soft)',
            fontWeight: '900',
            cursor: 'pointer',
            boxShadow: '0 4px 0 rgba(0,0,0,0.05)', 
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Ver ficha completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;