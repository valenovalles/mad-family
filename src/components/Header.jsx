import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToogle';
import CategoryFilters from './CategoryFilter';
import logoMF from '../assets/logo_def.png'; 

const Header = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 📱 ESTADO NUEVO: Controla si se despliega el filtro en móvil (cerrado por defecto)
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const esPerfil = location.pathname === '/perfil';
  const esFavoritos = location.pathname === '/favoritos';
  const vistaActual = location.pathname.replace('/', '');

  // Estilo para los iconos de acción
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
        gap: '12px'
      }}>
        {/* LOGO */}
        <img 
          src={logoMF} 
          alt="Mad Family Logo" 
          onClick={() => navigate('/')}
          style={{ height: '42px', cursor: 'pointer' }} 
        />

        {/* CONTENIDO DINÁMICO CENTRAL / DERECHO */}
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
          
          {/* CASO 1: MAPA o LISTA (Buscador central + Botón Colapsable de Filtros) */}
          {(location.pathname === '/lista' || location.pathname === '/mapa') ? (
            <div style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <SearchBar setBusqueda={props.setBusqueda} />
              </div>
              
              {/* 🎛️ NUEVO BOTÓN: Activa/Desactiva las categorías. Solo se verá en móviles */}
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
            /* CASO 2: HOME, PERFIL, FAVORITOS o PAGEDETAILS (Sin buscador, limpia el UI/UX de filtros) */
            <>
              {/* Si es Perfil/Favs, mostramos el texto */}
              {(esPerfil || esFavoritos) && (
                <h2 style={{ color: 'white', margin: '0 auto 0 0', fontSize: '1.1rem', fontWeight: '900' }}>
                  {esPerfil ? 'Mi Perfil' : 'Mis Favoritos'}
                </h2>
              )}

              {/* Si estamos en la ficha detallada de un plan, mostramos un título limpio */}
              {location.pathname.startsWith('/lugar/') && (
                <h2 style={{ color: 'white', margin: '0 auto 0 0', fontSize: '1.1rem', fontWeight: '900' }}>
                  Ver Plan
                </h2>
              )}

              {/* Iconos de acceso rápido (Visibles en Home, Perfil, Favs y Detalles) */}
              <span 
                className="material-symbols-rounded" 
                onClick={() => navigate('/favoritos')}
                style={{ 
                  ...actionIconStyle,
                  fontVariationSettings: esFavoritos ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                favorite
              </span>

              <div 
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

      {/* 🎯 SECCIÓN INFERIOR OPTIMIZADA: Solo aparece estrictamente en Mapa o Lista */}
      {(location.pathname === '/lista' || location.pathname === '/mapa') && (
        <div style={{ paddingBottom: '10px' }}>
          {/* Mantenemos el ViewToggle siempre a la vista */}
          <ViewToggle vista={vistaActual} setVista={props.setVista} />
          
          {/* Envolvemos CategoryFilters en un contenedor animado mediante CSS */}
          <div className={`colapsable-categorias-container ${mostrarCategorias ? 'abierto' : ''}`}>
            <CategoryFilters 
              filtroCat={props.filtroCat} 
              setFiltroCat={props.setFiltroCat} 
            />
          </div>
        </div>
      )}

      {/* 🎨 REGLAS CSS RESPONSIVE PARA DOS FILAS EN MÓVIL */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* COMPORTAMIENTO EN MÓVIL (Por defecto cerrado) */
        .colapsable-categorias-container {
          max-height: 0px;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 0px;
        }

        /* CUANDO SE ABRE EN EL MÓVIL */
        .colapsable-categorias-container.abierto {
          max-height: 110px; /* 🔥 CLAVE: Ampliamos a 110px para que entren las dos filas completas sin cortes */
          opacity: 1;
          pointer-events: auto;
          margin-top: 8px;
          overflow: visible !important; /* Permitimos que se vean las dos líneas limpiamente */
        }

        /* COMPORTAMIENTO EN ORDENADOR / TABLET */
        @media (min-width: 768px) {
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