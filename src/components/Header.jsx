import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToogle';
import CategoryFilters from './CategoryFilter';
import logoMF from '../assets/logo_def.png'; 

// 👤 Recibimos la prop session o el email si lo estás pasando desde App.jsx
const Header = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 📱 Estado para desplegar filtros en móvil
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const esPerfil = location.pathname === '/perfil';
  const esFavoritos = location.pathname === '/favoritos';
  const esChivarPlan = location.pathname === '/chivar-plan';
  const vistaActual = location.pathname.replace('/', '');

  // Extraemos el email si viene en las props o si modificamos la llamada en App.jsx
  const userEmail = props.session?.user?.email || props.email;

  // Estilo para los iconos de acción de escritorio
  const actionIconStyle = {
    color: 'white',
    cursor: 'pointer',
    fontSize: '1.6rem',
    transition: 'transform 0.2s'
  };

  return (
    <header style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: 'var(--shadow-soft)',
      backgroundColor: '#F08BB3', 
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* SECCIÓN SUPERIOR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 15px',
        gap: '12px',
        justifyContent: 'space-between' // 🔥 Empuja logo a la izquierda y contenido a la derecha
      }}>
        {/* LOGO */}
        <img 
          src={logoMF} 
          alt="Mad Family Logo" 
          onClick={() => navigate('/')}
          style={{ height: '42px', cursor: 'pointer' }} 
        />

        {/* CONTENIDO DINÁMICO DERECHO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* CASO 1: MAPA o LISTA (Buscador central + Botón Colapsable de Filtros) */}
          {(location.pathname === '/lista' || location.pathname === '/mapa') ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* 🖥️ BOTÓN COLABORATIVO EN ESCRITORIO (Dentro de mapa/lista) */}
              <button
                className="desktop-only-icon button-chivar-desktop"
                onClick={() => navigate('/chivar-plan')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: esChivarPlan ? 'var(--color-main-blue)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px dashed white',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginRight: '5px',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', fontVariationSettings: "'FILL' 1" }}>
                  add_comment
                </span>
                Chivar plan
              </button>

              <div style={{ maxWidth: '180px' }}>
                <SearchBar setBusqueda={props.setBusqueda} />
              </div>
              
              <button
                className="toggle-categorias-btn"
                onClick={() => setMostrarCategorias(!mostrarCategorias)}
                style={{
                  backgroundColor: mostrarCategorias ? 'var(--color-main-blue)' : 'white',
                  color: mostrarCategorias ? 'white' : '#F08BB3',
                  border: 'none',
                  borderRadius: '12px',
                  height: '40px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
                  {mostrarCategorias ? 'close' : 'tune'}
                </span>
              </button>
            </div>
          ) : (
            /* CASO 2: HOME, PERFIL, FAVORITOS, CHIVAR-PLAN o PAGEDETAILS */
            <>
              {/* Títulos limpios de sección */}
              {(esPerfil || esFavoritos || esChivarPlan) && (
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>
                  {esPerfil ? 'Mi Perfil' : esFavoritos ? 'Mis Favoritos' : 'Chívanos un plan'}
                </h2>
              )}

              {location.pathname.startsWith('/lugar/') && (
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>
                  Ver Plan
                </h2>
              )}

              {/* ✉️ TEXTO EXCLUSIVO MÓVIL: "Family: email" */}
              {userEmail && (
                <span className="mobile-family-text" style={{
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  opacity: 0.95
                }}>
                  Family: <strong style={{ fontWeight: '900' }}>{userEmail.split('@')[0]}</strong>
                </span>
              )}

              {/* 🖥️ BOTÓN COLABORATIVO EN ESCRITORIO (Fuera de mapa/lista) */}
              <button
                className="desktop-only-icon button-chivar-desktop"
                onClick={() => navigate('/sugerir-plan')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  backgroundColor: esChivarPlan ? 'var(--color-main-blue)' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px dashed white',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: '1.2rem', fontVariationSettings: "'FILL' 1" }}>
                  add_comment
                </span>
                Chivar plan
              </button>

              {/* 🖥️ ICONOS EXCLUSIVOS DE ESCRITORIO */}
              <span 
                className="material-symbols-rounded desktop-only-icon" 
                onClick={() => navigate('/favoritos')}
                style={{ 
                  ...actionIconStyle,
                  fontVariationSettings: esFavoritos ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                favorite
              </span>

              <div 
                className="desktop-only-icon"
                onClick={() => navigate('/perfil')}
                style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  backgroundColor: 'var(--color-main-blue)', border: '2px solid white',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', 
                  color: 'white', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                MF
              </div>
            </>
          )}
        </div>
      </div>

      {/* SECCIÓN INFERIOR OPTIMIZADA: Solo en Mapa o Lista */}
      {(location.pathname === '/lista' || location.pathname === '/mapa') && (
        <div style={{ paddingBottom: '10px' }}>
          <ViewToggle vista={vistaActual} setVista={props.setVista} />
          <div className={`colapsable-categorias-container ${mostrarCategorias ? 'abierto' : ''}`}>
            <CategoryFilters 
              filtroCat={props.filtroCat} 
              setFiltroCat={props.setFiltroCat} 
            />
          </div>
        </div>
      )}

      {/* 🎨 REGLAS RESPONSIVE DE VISIBILIDAD */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* 📱 COMPORTAMIENTO EN MÓVIL (Por defecto) */
        .desktop-only-icon {
          display: none !important;
        }
        .mobile-family-text {
          display: inline-block !important;
        }

        .colapsable-categorias-container {
          max-height: 0px;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 0px;
        }

        .colapsable-categorias-container.abierto {
          max-height: 110px;
          opacity: 1;
          pointer-events: auto;
          margin-top: 8px;
          overflow: visible !important;
        }

        /* 🖥️ COMPORTAMIENTO EN ESCRITORIO (A partir de 768px) */
        @media (min-width: 768px) {
          .desktop-only-icon {
            display: flex !important;
          }
          /* Forzamos a que el botón que es un <button> use flex en escritorio en vez de inline-block */
          .button-chivar-desktop {
            display: flex !important;
          }
          .mobile-family-text {
            display: none !important;
          }

          .toggle-categorias-btn {
            display: none !important;
          }
          
          .colapsable-categorias-container {
            max-height: none !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            margin-top: 8px !important;
            overflow: visible !important;
          }
        }
      `}} />
    </header>
  );
};

export default Header;