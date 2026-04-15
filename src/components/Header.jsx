import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import ViewToggle from './ViewToogle';
import CategoryFilters from './CategoryFilter';
import logoMF from '../assets/logo_def.png'; 

const Header = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const esHome = location.pathname === '/home';
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
          onClick={() => navigate('/home')}
          style={{ height: '42px', cursor: 'pointer' }} 
        />

        {/* CONTENIDO DINÁMICO CENTRAL / DERECHO */}
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
          
          {/* CASO 1: MAPA o LISTA (Buscador central + Iconos que ya vienen en SearchBar) */}
          {!esHome && !esPerfil && !esFavoritos ? (
            <div style={{ width: '100%' }}>
              <SearchBar setBusqueda={props.setBusqueda} />
            </div>
          ) : (
            /* CASO 2: HOME, PERFIL o FAVORITOS (Sin buscador, solo iconos o título) */
            <>
              {/* Si es Perfil/Favs, mostramos el texto */}
              {(esPerfil || esFavoritos) && (
                <h2 style={{ color: 'white', margin: '0 auto 0 0', fontSize: '1.1rem', fontWeight: '900' }}>
                  {esPerfil ? 'Mi Perfil' : 'Mis Favoritos'}
                </h2>
              )}

              {/* Iconos de acceso rápido (Visibles en Home, Perfil y Favs) */}
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

      {/* SECCIÓN INFERIOR: Solo aparece en Mapa o Lista */}
      {!esHome && !esPerfil && !esFavoritos && (
        <div style={{ paddingBottom: '10px' }}>
          <ViewToggle vista={vistaActual} setVista={props.setVista} />
          <CategoryFilters 
            filtroCat={props.filtroCat} 
            setFiltroCat={props.setFiltroCat} 
          />
        </div>
      )}
    </header>
  );
};

export default Header;