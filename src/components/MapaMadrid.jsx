import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../index.css'
import PlaceCard from './PlaceCard';

// Función para obtener el color de las variables del index.css
const getCategoryColor = (categoria) => {
  // Intentamos sacar el color del CSS, si falla usamos el default
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue(`--cat-${categoria}`).trim();
  return color || style.getPropertyValue('--cat-default').trim();
};

// Creador de iconos personalizados
const createCustomIcon = (categoria) => {
  const color = getCategoryColor(categoria);

  // Definimos los dibujos (SVG) de tus formas
  const shapes = {
    // Tu ESTRELLA del wireframe
    restaurante: `<polygon points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9" fill="${color}" stroke="white" stroke-width="2"/>`,
    
    // Tu FLOR del wireframe
    ocio: `<path d="M12 2C14 2 15 5 15 5C15 5 18 4 19 6C20 8 18 9 18 9C18 9 21 10 21 12C21 14 18 15 18 15C18 15 20 16 19 18C18 20 15 19 15 19C15 19 14 22 12 22C10 22 9 19 9 19C9 19 6 20 5 18C4 16 6 15 6 15C6 15 3 14 3 12C3 10 6 9 6 9C6 9 4 8 5 6C6 4 9 5 9 5C9 5 10 2 12 2Z" fill="${color}" stroke="white" stroke-width="2"/>`,
    
    // Tu CÍRCULO
    parque: `<circle cx="12" cy="12" r="9" fill="${color}" stroke="white" stroke-width="2"/>`,
    
    // Tu ROMBO/CUADRADO ROTADO
    cultura: `<rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="${color}" stroke="white" stroke-width="2"/>`,
    
    // Por defecto una forma suave
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
    iconSize: [40, 40], // Más grandes
    iconAnchor: [20, 20], // Centrados
    popupAnchor: [0, -20]
  });
};

// COMPONENTE: Añadidas las props favoritos y toggleFavorito
export default function MapaMadrid({ places, favoritos = [], toggleFavorito }) {
  return (
    <div style={{ 
      height: 'calc(100vh - 230px)', 
      width: '100%', 
      borderRadius: '0px', 
      overflow: 'hidden', 
      position: 'relative'
    }}>
      <MapContainer 
        /* AJUSTES CLAVE:
           1. Center: Bajamos un poco la latitud (de 40.41 a 40.40) 
              para centrar mejor la zona entre Centro y Carabanchel.
           2. Zoom: Bajamos a 12 para que se vea un área más amplia.
        */
        center={[40.3950, -3.7100]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {places.map((sitio) => (
          <Marker 
            key={sitio.id} 
            position={sitio.coords} 
            icon={createCustomIcon(sitio.categoria)}
          >
            <Popup minWidth={250}>
              {/* PASAMOS LAS PROPS: Asegurando el matching numérico para pintar el corazón */}
              <PlaceCard 
                sitio={sitio} 
                isFav={favoritos.map(Number).includes(Number(sitio.id))} 
                onToggleFav={() => toggleFavorito(sitio.id)} 
              />
            </Popup>
          </Marker>
        ))}
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