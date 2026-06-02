import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // 🔍 Importante para leer el id de la URL
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../index.css';
import PlaceCard from './PlaceCard';

// Función para obtener el color de las variables del index.css
const getCategoryColor = (categoria) => {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue(`--cat-${categoria}`).trim();
  return color || style.getPropertyValue('--cat-default').trim();
};

// Creador de iconos personalizados
const createCustomIcon = (categoria) => {
  const color = getCategoryColor(categoria);

  const shapes = {
    restaurante: `<polygon points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9" fill="${color}" stroke="white" stroke-width="2"/>`,
    ocio: `<path d="M12 2C14 2 15 5 15 5C15 5 18 4 19 6C20 8 18 9 18 9C18 9 21 10 21 12C21 14 18 15 18 15C18 15 20 16 19 18C18 20 15 19 15 19C15 19 14 22 12 22C10 22 9 19 9 19C9 19 6 20 5 18C4 16 6 15 6 15C6 15 3 14 3 12C3 10 6 9 6 9C6 9 4 8 5 6C6 4 9 5 9 5C9 5 10 2 12 2Z" fill="${color}" stroke="white" stroke-width="2"/>`,
    parque: `<circle cx="12" cy="12" r="9" fill="${color}" stroke="white" stroke-width="2"/>`,
    cultura: `<rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="${color}" stroke="white" stroke-width="2"/>`,
    default: `<rect x="4" y="4" width="16" height="16" rx="5" fill="${color}" stroke="white" stroke-width="2"/>`
  };

  const svgIcon = shapes[categoria] || shapes.default;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <svg width="40" height="40" viewBox="0 0 24 24" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3));">
        ${svgIcon}
      </svg>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// 🗺️ SUBCOMPONENTE CONTROLADOR: Mueve la cámara al sitio seleccionado de forma nativa
function ControladorCentroMapa({ seleccionado }) {
  const map = useMap();
  
  useEffect(() => {
    if (seleccionado) {
      map.setView(seleccionado.coords, 15, { animate: false });
    }
  }, [seleccionado, map]);

  return null;
}

// COMPONENTE: Añadidas las props favoritos, toggleFavorito y onMarkerClick (para la Home)
export default function MapaMadrid({ places, favoritos = [], toggleFavorito, onMarkerClick }) {
  const location = useLocation();

  // 🔍 Capturamos el ID que viene de la URL (?seleccionar=ID)
  const params = new URLSearchParams(location.search);
  const idParaSeleccionar = params.get('seleccionar');
  
  // Buscamos el objeto completo del sitio seleccionado en el array
  const sitioSeleccionado = places.find(p => Number(p.id) === Number(idParaSeleccionar));

  return (
    <div style={{ 
      height: onMarkerClick ? '100%' : 'calc(100vh - 230px)', // 100% en el mapa mini de la Home, calc en grande
      width: '100%', 
      borderRadius: '0px', 
      overflow: 'hidden', 
      position: 'relative'
    }}>
      <MapContainer 
        center={sitioSeleccionado ? sitioSeleccionado.coords : [40.3950, -3.7100]} 
        zoom={sitioSeleccionado ? 15 : 12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Mueve el foco del mapa dinámicamente si hay un sitio seleccionado */}
        <ControladorCentroMapa seleccionado={sitioSeleccionado} />
        
        {places.map((sitio) => {
          const esElSeleccionado = Number(sitio.id) === Number(idParaSeleccionar);

          return (
            <Marker 
              key={sitio.id} 
              position={sitio.coords} 
              icon={createCustomIcon(sitio.categoria)}
              // 🎯 Capturamos el clic del icono
              eventHandlers={{
                click: (e) => {
                  if (onMarkerClick) {
                    L.DomEvent.stopPropagation(e); // Frena el popup local del mapa mini
                    onMarkerClick(sitio.id);       // Salta al mapa grande pasando el id por la URL
                  }
                },
              }}
            >
              {/* 🔒 Si estamos en la Home (onMarkerClick activo), ocultamos los popups locales.
                  🖥️ Si estamos en el mapa grande, renderizamos con la directiva de auto-apertura nativa.
              */}
              {!onMarkerClick && (
                <Popup 
                  minWidth={250}
                  // 🔥 EL DISPARADOR NATIVO: En cuanto el Popup se añade ('add') al DOM del mapa grande,
                  // se auto-abre inmediatamente de forma interna en Leaflet. ¡Infalible!
                  eventHandlers={
                    esElSeleccionado 
                      ? { add: (e) => e.target.openPopup() } 
                      : {}
                  }
                >
                  <PlaceCard 
                    sitio={sitio} 
                    isFav={favoritos.map(Number).includes(Number(sitio.id))} 
                    onToggleFav={() => toggleFavorito(sitio.id)} 
                  />
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-popup-content-wrapper {
          border-radius: 20px;
          padding: 0;
          overflow: hidden;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 250px !important;
        }
        .leaflet-container {
          background-color: var(--color-bg-cream);
        }
      `}} />
    </div>
  );
}