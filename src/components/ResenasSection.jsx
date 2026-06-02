import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ResenasSection = ({ sitioId, session, setMostrarAuthModal }) => {
  const [resenas, setResenas] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [mostrarAvisoModeracion, setMostrarAvisoModeracion] = useState(false);

  // 📥 CARGAR RESEÑAS APROBADAS
  useEffect(() => {
    if (sitioId) {
      const cargarResenas = async () => {
        const { data, error } = await supabase
          .from('resenas')
          .select('*')
          .eq('place_id', sitioId)
          .eq('aprobada', true) // 🔒 Tu filtro de moderación activo
          .order('created_at', { ascending: false });

        if (!error && data) {
          setResenas(data);
        }
      };
      cargarResenas();
    }
  }, [sitioId]);

  // 📤 ENVIAR RESEÑA A SUPABASE
  const handleEnviarResena = async (e) => {
    e.preventDefault();
    
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
          place_id: sitioId,
          user_email: session.user.email,
          comentario: nuevoComentario,
          puntuacion: puntuacion
        }
      ])
      .select();

    setEnviandoResena(false);

    if (error) {
      console.error("Error al guardar la reseña:", error.message);
    } else if (data) {
      setNuevoComentario('');
      setPuntuacion(5);
      setMostrarAvisoModeracion(true);
      
      setTimeout(() => {
        setMostrarAvisoModeracion(false);
      }, 5000);
    }
  };

  return (
    <>
      <hr style={{ border: 0, borderTop: '2px dashed #e2ded7', margin: '40px 0 25px' }} />
      
      <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--color-text)', marginBottom: '15px', textAlign: 'left' }}>
        Opiniones de la comunidad 💬
      </h3>

      {/* Formulario para dejar opiniones */}
      <form onSubmit={handleEnviarResena} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '22px', boxShadow: 'var(--shadow-soft)', marginBottom: '30px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', fontWeight: '800', color: '#666', textAlign: 'left' }}>
          {session ? `Opinando como: ${session.user.email}` : "Inicia sesión para valorar este sitio"}
        </p>
        
        {/* Selector de estrellas */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '15px' }}>
          {[1, 2, 3, 4, 5].map((estrella) => (
            <span
              key={estrella}
              className="material-symbols-rounded"
              onClick={() => session && setPuntuacion(estrella)}
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
          onClick={() => !session && setMostrarAuthModal(true)}
          required
          disabled={!session}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '12px', lineHeight: '1.4' }}
        />

        {session && (
          <button type="submit" disabled={enviandoResena} style={{ width: '100%', height: '42px', backgroundColor: 'var(--color-main-pink)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 3px 0 rgba(0,0,0,0.04)' }}>
            {enviandoResena ? 'Publicando...' : 'Publicar reseña familiar'}
          </button>
        )}

        {/* Aviso de moderación */}
        {mostrarAvisoModeracion && (
          <div style={{ marginTop: '15px', backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9', color: '#2e7d32', padding: '12px 15px', borderRadius: '14px', fontSize: '0.85rem', fontWeight: '700', textAlign: 'left', lineHeight: '1.4' }}>
            👋 ¡Gracias por tu reseña, family! Para mantener la comunidad segura y libre de spam, tu comentario estará visible en cuanto el equipo de madFamily lo revise. ✨
          </div>
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
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--color-main-blue)' }}>
                  {/* Seccionamos de forma segura comprobando que exista el correo */}
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
    </>
  );
};

export default ResenasSection;