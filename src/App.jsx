import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import MapaMadrid from './components/MapaMadrid'
import PlaceCard from './components/PlaceCard'
import FooterNav from './components/FooterNav'
import Favoritos from './components/Favorites'
import Perfil from './components/Profile'
import Home from './components/Home'
import places from './data/places.json'
ReactGA.initialize("G-M53B8QCB3P");

function App() {
  const [busqueda, setBusqueda] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // --- LÓGICA DE FAVORITOS (LocalStorage) ---
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('mad-favoritos');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('mad-favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (id) => {
    setFavoritos(prev => {
      const yaEsFavorito = prev.includes(id);
      
      // Enviamos evento a Google SOLO si lo está añadiendo
      if (!yaEsFavorito) {
        const sitio = places.find(p => p.id === id);
        ReactGA.event({
          category: "Interacción",
          action: "Añadir Favorito",
          label: sitio ? sitio.nombre : `ID: ${id}`,
        });
      }

      // Lógica de actualización del estado
      return yaEsFavorito 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
    });
  };

  // --- LÓGICA DE FILTRADO Y URL ---
  const params = new URLSearchParams(location.search);
  const filtroCat = params.get('categoria') || 'todos';

  const actualizarFiltro = (nuevaCat) => {
    // Enviamos evento de qué categoría interesa
    ReactGA.event({
      category: "Filtros",
      action: "Seleccionar Categoría",
      label: nuevaCat,
    });

    const path = (location.pathname === '/home' || location.pathname === '/perfil' || location.pathname === '/favoritos') 
      ? '/lista' 
      : location.pathname;
    navigate(`${path}?categoria=${nuevaCat}`);
  };

  const sitiosFiltrados = places.filter(sitio => {
    const coincideTexto = sitio.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = filtroCat === 'todos' || sitio.categoria === filtroCat;
    return coincideTexto && coincideCat;
  });

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-cream)' }}>
      
    <Header 
      setBusqueda={setBusqueda} 
      setFiltroCat={actualizarFiltro} 
      filtroCat={filtroCat} 
    />
      
      <main className="app-content-wrapper" style={{ flex: 1, position: 'relative' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={
          <Home setFiltroCat={actualizarFiltro} places={places} />
        } />

        <Route path="/mapa" element={
          <MapaMadrid places={sitiosFiltrados} />
        } />

        <Route path="/lista" element={
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px', justifyItems: 'center' }}>
            {sitiosFiltrados.map(sitio => (
              <PlaceCard 
                key={sitio.id} 
                sitio={sitio} 
                isFav={favoritos.includes(sitio.id)} 
                onToggleFav={() => toggleFavorito(sitio.id)} 
              />
            ))}
          </div>
        } />

        {/* RUTA FAVORITOS LIMPIA (Usando tu componente) */}
        <Route path="/favoritos" element={
          <Favoritos 
            favoritos={favoritos} 
            places={places} 
            toggleFavorito={toggleFavorito} 
          />
        } />

        {/* RUTA PERFIL LIMPIA */}
        <Route path="/perfil" element={
          <Perfil numFavoritos={favoritos.length} />
        } />
      </Routes>
      </main>

      <FooterNav />
    </div>
  )
}

export default App;