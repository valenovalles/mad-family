import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // <-- IMPORTANTE: Para conectar con la tabla 'resenas'

const PageDetails = ({ places, session, setMostrarAuthModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copiado, setCopiado] = useState(false);
  
  // 💬 ESTADOS PARA EL SISTEMA DE RESEÑAS
  const [resenas, setResenas] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5); // 5 estrellas por defecto
  const [enviandoResena, setEnviandoResena] = useState(false);

  // Buscamos el sitio en tu JSON local
  const sitio = places.find(p => p.id === parseInt(id));

  // 📥 CARGAR RESEÑAS: Se ejecuta cada vez que entramos a la ficha de un sitio
  useEffect(() => {
    if (sitio) {
      const cargarResenas = async () => {
        const { data, error } = await supabase
          .from('resenas')
          .select('*')
          .eq('place_id', sitio.id)
          .order('created_at', { ascending: false }); // Las más recientes arriba

        if (!error && data) {
          setResenas(data);
        }
      };
      cargarResenas();
    }
  }, [sitio]);

  if (!sitio) return <div style={{ padding: '20px', textAlign: 'center' }}>¡Lugar no encontrado! 😅</div>;

  // Codificamos el nombre y las coordenadas para que la URL sea completamente válida
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

  // 📤 ENVIAR RESEÑA A SUPABASE
  const handleEnviarResena = async (e) => {
    e.preventDefault();
    
    // Si un usuario anónimo intenta saltarse el bloqueo y enviar, le abrimos el registro
    if (!session) {
      setMostrarAuthModal(true);
      return;
    }

    if (!nuevoComentario.trim()) return;
    setEnviandoResena(true);

    const { data, error } = await supabase
      .from('resenas')
      .insert([
        {
          place_id: sitio.id,
          user_email: session.user.email,
          comentario: nuevoComentario,
          puntuacion: puntuacion
        }
      ])
      .select(); // Nos devuelve la fila insertada para actualizar la pantalla al instante

    setEnviandoResena(false);

    if (error) {
      console.error("Error al guardar la reseña:", error.message);
    } else if (data) {
      // Añadimos la nueva opinión arriba del todo de forma instantánea
      setResenas(prev => [data[0], ...prev]);
      setNuevoComentario('');
      setPuntuacion(5);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-cream)', paddingBottom: '100px', position: 'relative' }}>
      
      {copiado && (
        <div style={{ position: 'fixed', top: '20px', left: '20px', right: '20px', backgroundColor: 'var(--color-text)', color: 'white', padding: '12px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: '800', textAlign: 'center', zIndex: '1000', boxShadow: '0 8px 25px rgba(0,0,0,0.2)', animation: 'fadeInOutDetails 2.5s ease-in-out' }}>
          ¡Enlace del planazo copiado para WhatsApp! 🚀
        </div>
      )}

      {/* HEADER IMAGEN */}
      <div style={{ position: 'relative', height: '280px', width: '100%' }}>
        <img src={sitio.imagen} alt={sitio.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)', cursor: 'pointer', zIndex: 10 }}>
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
      </div>

      {/* CONTENIDO DE LA FICHA */}
      <div style={{ marginTop: '-30px', backgroundColor: 'var(--color-bg-cream)', borderRadius: '30px 30px 0 0', padding: '25px', position: 'relative', zIndex: 2 }}>
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

        {/* 💬 --- NUEVA SECCIÓN VISUAL: SISTEMA DE RESEÑAS --- */}
        <hr style={{ border: 0, borderTop: '2px dashed #e2ded7', margin: '40px 0 25px' }} />
        
        <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--color-text)', marginBottom: '15px', textAlign: 'left' }}>
          Opiniones de la comunidad 💬
        </h3>

        {/* Formulario para dejar opiniones */}
        <form onSubmit={handleEnviarResena} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '22px', boxShadow: 'var(--shadow-soft)', marginBottom: '30px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: '800', color: '#666', textAlign: 'left' }}>
            {session ? `Opinando como: ${session.user.email}` : "Inicia sesión para valorar este sitio"}
          </p>
          
          {/* Selector de estrellas interactivo */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
            {[1, 2, 3, 4, 5].map((estrella) => (
              <span
                key={estrella}
                className="material-symbols-rounded"
                onClick={() => session && setPuntuacion(estrella)} // Solo deja cambiar estrellas si está logueado
                style={{
                  cursor: session ? 'pointer' : 'default',
                  fontSize: '1.7rem',
                  color: estrella <= puntuacion ? '#FFB300' : '#DDD',
                  fontVariationSettings: "'FILL' 1"
                }}
              >
                star
              </span>
            ))}
          </div>

          <textarea
            rows="3"
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder={session ? "Cuéntale a otras familias tu experiencia..." : "Inicia sesión o regístrate para poder dejar tu reseña 👶✨"}
            onClick={() => !session && setMostrarAuthModal(true)} // Salta el modal de login si es anónimo
            required
            disabled={!session}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px', lineHeight: '1.4' }}
          />

          {session && (
            <button type="submit" disabled={enviandoResena} style={{ width: '100%', height: '42px', backgroundColor: 'var(--color-main-pink)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,0.04)' }}>
              {enviandoResena ? 'Publicando...' : 'Publicar reseña familiar'}
            </button>
          )}
        </form>

        {/* Listado dinámico de opiniones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {resenas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', fontStyle: 'italic', padding: '15px 0' }}>
              Aún no hay reseñas de este sitio. ¡Sé la primera family en opinar! 🌟
            </p>
          ) : (
            resenas.map((res) => (
              <div key={res.id} style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '15px', borderRadius: '18px', border: '1px solid #ebdcb9', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  {/* Anonimizamos el email recortándolo para proteger la privacidad en pantalla */}
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-main-blue)' }}>
                    👪 {res.user_email ? `${res.user_email.split('@')[0]}...` : 'Family'}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map((est) => (
                      <span key={est} className="material-symbols-rounded" style={{ fontSize: '0.95rem', color: est <= res.puntuacion ? '#FFB300' : '#DDD', fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: '1.4' }}>
                  {res.comentario}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeInOutDetails { 0% { opacity: 0; transform: translateY(-20px); } 10% { opacity: 1; transform: translateY(0); } 90% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }` }} />
    </div>
  );
};

export default PageDetails;