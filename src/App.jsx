import React, { useState, useEffect } from 'react'
import ReactGA from 'react-ga4'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient' // CLIENTE DE SUPABASE
import Header from './components/Header'
import MapaMadrid from './components/MapaMadrid'
import PlaceCard from './components/PlaceCard'
import FooterNav from './components/FooterNav'
import Favoritos from './components/Favorites'
import Perfil from './components/Profile'
import Home from './components/Home'
import places from './data/places.json'
import PageDetails from './components/PageDetails'
import Auth from './components/Auth' // COMPONENTE AUTH
import Form from './components/Form' // COMPONENTE FORM

ReactGA.initialize("G-M53B8QCB3P");

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [session, setSession] = useState(null); // Guarda si hay usuario logueado o no
  const [loadingSession, setLoadingSession] = useState(true); // Para evitar parpadeos al cargar
  const [favoritos, setFavoritos] = useState([]); // Estado inicial de favoritos limpio
  const [mostrarAuthModal, setMostrarAuthModal] = useState(false); // <-- NUEVO: Controla la pantalla de registro
  const location = useLocation();
  const navigate = useNavigate();

  // --- LÓGICA DE AUTENTICACIÓN Y FAVORITOS UNIFICADA ---
  useEffect(() => {
    const cargarFavoritosEnBBDD = async () => {
      const { data, error } = await supabase
        .from('favoritos')
        .select('place_id');

      if (error) {
        console.error("Error cargando favoritos:", error.message);
      } else if (data) {
        const idsGuardados = data.map(item => item.place_id);
        setFavoritos(idsGuardados);
      }
    };

    // 1. Comprobamos la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        cargarFavoritosEnBBDD();
      }
      setLoadingSession(false);
    });

    // 2. Escuchamos cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        cargarFavoritosEnBBDD();
        setMostrarAuthModal(false); // Si se loguea con éxito, cerramos el bloqueo visual
      } else {
        setFavoritos([]);
      }
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- GOOGLE ANALYTICS ---
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  // --- INTERRUPTOR DE FAVORITOS (Ahora con Gancho de Registro) ---
  const toggleFavorito = async (id) => {
    // 🧲 EL GANCHO DE CONVERSIÓN: Si no está logueado, le paramos los pies y le invitamos a registrarse
    if (!session) {
      setMostrarAuthModal(true);
      return;
    }

    const idNumerico = Number(id);
    const yaEsFavorito = favoritos.map(Number).includes(idNumerico);
    const userId = session.user.id;

    if (yaEsFavorito) {
      setFavoritos(prev => prev.map(Number).filter(favId => favId !== idNumerico));
      const { error } = await supabase.from('favoritos').delete().eq('user_id', userId).eq('place_id', idNumerico);
      if (error) setFavoritos(prev => [...prev, idNumerico]);
    } else {
      setFavoritos(prev => [...prev, idNumerico]);
      
      const sitio = places.find(p => Number(p.id) === idNumerico);
      ReactGA.event({ category: "Interacción", action: "Añadir Favorito", label: sitio ? sitio.nombre : `ID: ${idNumerico}` });

      const { error } = await supabase.from('favoritos').insert([{ user_id: userId, place_id: idNumerico }]);
      if (error) setFavoritos(prev => prev.map(Number).filter(favId => favId !== idNumerico));
    }
  };

  // --- LÓGICA DE FILTRADO Y URL ---
  const params = new URLSearchParams(location.search);
  const filtroCat = params.get('categoria') || 'todos';

  const actualizarFiltro = (nuevaCat) => {
    const path = (location.pathname === '/home' || location.pathname === '/perfil' || location.pathname === '/favoritos') ? '/lista' : location.pathname;
    navigate(`${path}?categoria=${nuevaCat}`);
  };

  const sitiosFiltrados = places.filter(sitio => {
    const coincideTexto = sitio.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = filtroCat === 'todos' || sitio.categoria === filtroCat;
    return coincideTexto && coincideCat;
  });

  // PANTALLA DE CARGA TEMPORAL (Mientras Supabase verifica la sesión)
  if (loadingSession) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg-cream)', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
        Cargando Mad Family... 👶✨
      </div>
    );
  }

  // RENDERIZADO GLOBAL ACCESIBLE
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-cream)' }}>
      
      {/* CINTA FAMILIAR RESPONSIVE (Solo si está logueado, si no, no se muestra) */}
      {session && (
        <div className="family-badge-bar" style={{ 
          padding: '6px 20px', fontSize: '0.75rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center',
          color: 'white', letterSpacing: '0.5px', fontWeight: '700', zIndex: 100
        }}>
          <span>Family: <strong style={{ fontWeight: '900' }}>{session.user.email}</strong></span>
        </div>
      )}

      <Header setBusqueda={setBusqueda} setFiltroCat={actualizarFiltro} filtroCat={filtroCat} />
        
      <main className="app-content-wrapper" style={{ flex: 1, position: 'relative' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home setFiltroCat={actualizarFiltro} places={places} />} />
          <Route path="/mapa" element={<MapaMadrid places={sitiosFiltrados} favoritos={favoritos} toggleFavorito={toggleFavorito} />} />
          <Route 
            path="/lugar/:id" 
            element={
              <PageDetails 
                places={places} 
                session={session} 
                setMostrarAuthModal={setMostrarAuthModal} 
              />
            } 
          />
          
          <Route path="/lista" element={
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px', justifyItems: 'center' }}>
              {sitiosFiltrados.map(sitio => (
                <PlaceCard key={sitio.id} sitio={sitio} isFav={favoritos.map(Number).includes(Number(sitio.id))} onToggleFav={() => toggleFavorito(sitio.id)} />
              ))}
            </div>
          } />

          {/* RUTAS PROTEGIDAS VISUALMENTE (Si no hay sesión, les salta el modal en lugar de la pantalla vacía) */}
          <Route path="/favoritos" element={
            session 
              ? <Favoritos favoritos={favoritos} places={places} toggleFavorito={toggleFavorito} />
              : <div style={{ padding: '50px 20px', textAlign: 'center' }}><button onClick={() => setMostrarAuthModal(true)} style={{ backgroundColor: 'var(--color-main-pink)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' }}>Ver mis favoritos ❤️</button></div>
          } />

          <Route path="/perfil" element={
            session 
              ? <Perfil numFavoritos={favoritos.length} email={session.user.email} />
              : <div style={{ padding: '50px 20px', textAlign: 'center' }}><button onClick={() => setMostrarAuthModal(true)} style={{ backgroundColor: 'var(--color-main-blue)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' }}>Entrar a mi Perfil 👤</button></div>
          } />

          <Route path="/sugerir-plan" element={
            session
              ? <Form session={session} />
              : <div style={{ padding: '50px 20px', textAlign: 'center' }}><button onClick={() => setMostrarAuthModal(true)} style={{ backgroundColor: 'var(--color-main-blue)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' }}>Chivar un planazo 🤫</button></div>
          } />
        </Routes>
      </main>

      <FooterNav />

      {/* --- 💥 PANTALLA/MODAL FLOTANTE DE REGISTRO BLINDADO (PC & MÓVIL) --- */}
      {mostrarAuthModal && (
        <div style={{
          position: 'fixed', 
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-bg-cream)', 
          zIndex: 2000, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start', // Empieza arriba para evitar desbordamientos
          alignItems: 'center', 
          overflowY: 'auto', // Permite scroll si el contenido es más alto que la pantalla
          WebkitOverflowScrolling: 'touch',
          padding: '20px'
        }}>
          
          {/* Botón de cerrar */}
          <button 
            onClick={() => setMostrarAuthModal(false)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'none', border: 'none', color: '#888', cursor: 'pointer',
              zIndex: 2010
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '2rem' }}>close</span>
          </button>

          {/* CONTENEDOR ENVOLTORIO: Asegura el scroll y los márgenes en PC */}
          <div style={{ 
            maxWidth: '420px', 
            width: '100%', 
            textAlign: 'center',
            marginTop: '6vh', // Empuja el contenido hacia abajo un 6% de la pantalla
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: '3.5rem', color: 'var(--color-main-pink)', marginBottom: '10px' }}>
              family_home
            </span>
            <h2 style={{ color: 'var(--color-text)', fontWeight: '900', margin: '0 0 12px 0', fontSize: '1.6rem', lineHeight: '1.2' }}>
              ¡Aún no tienes perfil con nosotros! 👋✨
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 25px 0', padding: '0 10px' }}>
              Crea tu cuenta familiar en unos segundos para poder guardar tus planes favoritos, sincronizarlos y opinar con la comunidad.
            </p>
            
            {/* Tarjeta blanca contenedora: Forzamos aislamiento CSS */}
            <div style={{ 
              backgroundColor: 'white', 
              padding: '25px', 
              borderRadius: '25px', 
              boxShadow: 'var(--shadow-soft)',
              width: '100%',
              boxSizing: 'border-box',
              position: 'relative', // Resetea posicionamientos absolutos internos de Auth
              overflow: 'hidden' // Corta cualquier desborde rebelde de Auth
            }}>
              <Auth />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;