import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResenasSection from './ResenasSection'; // 🔥 Importamos el módulo de reseñas recién creado

const PageDetails = ({ places, session, setMostrarAuthModal, favoritos, toggleFavorito }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);

  // Buscamos el sitio en tu JSON local
  const sitio = places.find(p => p.id === parseInt(id));

  // ❤️ COMPROBACIÓN DE FAVORITO
  const esFavorito = favoritos ? favoritos.includes(sitio?.id) : false;

  if (!sitio) return <div style={{ padding: '20px', textAlign: 'center' }}>¡Lugar no encontrado! 😅</div>;

  // Codificamos las coordenadas y el mapa de forma limpia
  const consultaMaps = encodeURIComponent(`${sitio.nombre}, ${sitio.coords[0]},${sitio.coords[1]}`);
  const urlGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${consultaMaps}`;

  const handleShare = () => {
    const urlFicha = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `madFamily: ${sitio.nombre}`, text: `¡Mira este planazo! 🎡`, url: urlFicha });
    } else {
      setCopiado(true);
      navigator.clipboard.writeText(urlFicha);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const handleFavoritoClick = () => {
    if (!session) {
      setMostrarAuthModal(true);
    } else {
      toggleFavorito(sitio.id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-cream)', paddingBottom: '100px', position: 'relative' }}>
      
      {copiado && (
        <div style={{ position: 'fixed', top: '20px', left: '20px', right: '20px', backgroundColor: 'var(--color-text)', color: 'white', padding: '12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', textAlign: 'center', zIndex: '1000', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', animation: 'fadeInOutDetails 2.5s ease-in-out' }}>
          ¡Enlace del planazo copiado para WhatsApp! 🚀
        </div>
      )}

      {/* HEADER IMAGEN CON BORDE ONDULADO */}
      <div style={{ position: 'relative', height: '280px', width: '100%', overflow: 'hidden' }}>
        <img src={sitio.imagen} alt={sitio.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        
        {/* 🎨 ONDA FESTONEADA EN SVG: Integra la imagen con el fondo crema */}
        <svg 
          viewBox="0 0 100 12" 
          preserveAspectRatio="none" 
          style={{
            position: 'absolute',
            bottom: '-1px', // Evita micro-líneas extrañas de renderizado
            left: 0,
            width: '100%',
            height: '24px', // Altura del festón adaptado a la cabecera
            fill: 'var(--color-bg-cream)', // Corta la imagen integrándose con el fondo del contenido
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          <path d="M0,12 L100,12 L100,6 C95,6 92,0 87.5,0 C83,0 80,6 75,6 C70,6 67,0 62.5,0 C58,0 55,6 50,6 C45,6 42,0 37.5,0 C33,0 30,6 25,6 C20,6 17,0 12.5,0 C8,0 5,6 0,6 Z" />
        </svg>

        {/* Botón Atrás */}
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)', cursor: 'pointer', zIndex: 10 }}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>

        {/* ❤️ BOTÓN DE FAVORITOS (Flotante) */}
        <button 
          onClick={handleFavoritoClick} 
          style={{ 
            position: 'absolute', top: '20px', right: '20px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)', cursor: 'pointer', zIndex: 10, transition: 'transform 0.2s ease'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span 
            className="material-symbols-rounded" 
            style={{ 
              color: esFavorito ? 'var(--color-main-pink)' : '#ccc', fontSize: '1.5rem', fontVariationSettings: esFavorito ? "'FILL' 1" : "'FILL' 0" 
            }}
          >
            favorite
          </span>
        </button>
      </div>

      {/* CONTENIDO DE LA FICHA */}
      <div style={{ backgroundColor: 'var(--color-bg-cream)', padding: '25px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--color-text)', fontWeight: '900', textAlign: 'left' }}>{sitio.nombre}</h1>
          <span className="material-symbols-rounded" style={{ color: 'var(--color-main-pink)', fontSize: '2rem' }}>
            {sitio.categoria === 'restaurante' ? 'restaurant' : 'celebration'}
          </span>
        </div>

        <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem', marginTop: '15px', textAlign: 'left' }}>{sitio.resumen}</p>

        {/* DIRECCIÓN */}
        {sitio.direccion && (
          <div style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '20px', boxShadow: 'var(--shadow-soft)', marginTop: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--color-main-blue)', fontSize: '1.4rem' }}>location_on</span>
            <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: '700', textAlign: 'left' }}>{sitio.direccion}</p>
          </div>
        )}

        {/* BOTONES DE ACCIÓN */}
        <div style={{ marginTop: '25px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleShare} style={{ backgroundColor: 'white', color: 'var(--color-text)', border: '2px solid #eaeaea', height: '50px', width: '55px', borderRadius: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: 'var(--shadow-soft)' }}>
            <span className="material-symbols-rounded" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>share</span>
          </button>
          <a href={urlGoogleMaps} target="_blank" rel="noopener noreferrer" style={{ flex: 1, height: '50px', borderRadius: '20px', backgroundColor: 'var(--color-main-blue)', color: 'white', fontWeight: '900', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
            <span className="material-symbols-rounded">turn_right</span>Cómo llegar al planazo
          </a>
        </div>

        {/* 💬 LLAMADA AL SUBCOMPONENTE DE RESEÑAS REFACTORIZADO */}
        <ResenasSection 
          sitioId={sitio.id} 
          session={session} 
          setMostrarAuthModal={setMostrarAuthModal} 
        />

      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeInOutDetails { 0% { opacity: 0; transform: translateY(-10px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-10px); } }` }} />
    </div>
  );
};

export default PageDetails;