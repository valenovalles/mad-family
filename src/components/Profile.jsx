import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom'; // <-- IMPORTANTE: Traemos el hook para movernos de pantalla
import Modal from './Modal'; 

const Perfil = ({ numFavoritos, email }) => {
  const navigate = useNavigate(); // <-- Inicializamos el router

  // Estados para controlar el modal de Cerrar Sesión
  const [modalLogoutOpen, setModalLogoutOpen] = useState(false);
  
  // Estados para controlar el modal de Borrar Datos
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  
  const inicialAvatar = email ? email.charAt(0).toUpperCase() : 'F';

  const confirmarLogout = async () => {
    setModalLogoutOpen(false);
    await supabase.auth.signOut();
  };

  const confirmarClearData = () => {
    setModalDeleteOpen(false);
    localStorage.removeItem('mad-favoritos');
    window.location.reload(); 
  };

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '80vh' }}>
      
      {/* Avatar circular */}
      <div style={{ 
        width: '100px', height: '100px', 
        backgroundColor: 'var(--color-main-blue)', 
        borderRadius: '50%', margin: '0 auto 20px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        fontSize: '2.5rem', color: 'white', 
        border: '4px solid white', boxShadow: 'var(--shadow-soft)',
        fontWeight: '900'
      }}>
        {inicialAvatar}
      </div>
      
      <h2 style={{ fontWeight: '900', color: 'var(--color-text)', margin: '0 0 5px 0' }}>
        ¡Hola, Family!
      </h2>
      <p style={{ color: 'var(--color-main-pink)', fontWeight: '700', fontSize: '0.95rem', margin: '0 0 25px 0' }}>
        {email}
      </p>

      {/* --- 🤫 SECCIÓN NUEVA: CHÍVANOS UN PLAN (CALL TO ACTION DESTACADO) --- */}
      <div style={{
        maxWidth: '400px',
        margin: '0 auto 20px',
        backgroundColor: 'white',
        borderRadius: '25px',
        padding: '20px',
        boxShadow: 'var(--shadow-soft)',
        textAlign: 'center',
        border: '2px dashed #f9e6ee' // Un toque visual divertido de invitación
      }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#666', fontWeight: '700', lineHeight: '1.4' }}>
          ¿Has descubierto un sitio ideal con los peques que no está en nuestra guía? 🎡✨
        </p>
        <button
          onClick={() => navigate('/sugerir-plan')} // Redirige a tu formulario de Formspree
          style={{
            width: '100%',
            backgroundColor: 'var(--color-main-pink)', // Tu rosa potente del buscador
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '16px',
            fontWeight: '900',
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 0 rgba(0,0,0,0.05)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span className="material-symbols-rounded" style={{ fontSize: '1.2rem' }}>add_comment</span>
          Chívanos un buen plan 🤫
        </button>
      </div>
      
      {/* Caja de información y ajustes */}
      <div style={{ 
        backgroundColor: 'white', borderRadius: '25px', 
        padding: '25px', textAlign: 'left', boxShadow: 'var(--shadow-soft)',
        maxWidth: '400px', margin: '0 auto'
      }}>
        <p style={{ margin: '12px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <span className="material-symbols-rounded" style={{fontSize: '1.3rem', color: 'var(--color-main-blue)'}}>location_on</span>
          Ciudad: Madrid
        </p>
        <p style={{ margin: '12px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <span className="material-symbols-rounded" style={{fontSize: '1.3rem', color: 'var(--color-main-pink)'}}>favorite</span>
          Planes guardados: {numFavoritos}
        </p>
        <p style={{ margin: '12px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
          <span className="material-symbols-rounded" style={{fontSize: '1.3rem', color: '#4CAF50'}}>verified_user</span>
          Cuenta activa: ¡Sincronizada! ✅
        </p>
        
        <hr style={{ border: '0', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />
        
        {/* BOTÓN DE CERRAR SESIÓN */}
        <button 
          onClick={() => setModalLogoutOpen(true)} 
          style={{
            width: '100%', backgroundColor: 'var(--color-bg-cream)', color: 'var(--color-text)',
            border: '2px solid var(--color-main-blue)', padding: '12px', borderRadius: '16px',
            fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px'
          }}
        >
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>logout</span>
          Cerrar sesión de la cuenta
        </button>

        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => setModalDeleteOpen(true)} 
            style={{ 
              background: 'none', border: 'none', padding: 0,
              color: '#ff4d4d', fontWeight: '800', cursor: 'pointer',
              fontSize: '0.85rem', textDecoration: 'underline'
            }}
          >
            Borrar caché de favoritos local
          </button>
        </div>
      </div>

      {/* --- MODALES PERSONALIZADOS --- */}
      <Modal 
        isOpen={modalLogoutOpen}
        onClose={() => setModalLogoutOpen(false)}
        onConfirm={confirmarLogout}
        title="¿Te vas ya, family? 👶✨"
        message="¿Seguro que quieres cerrar sesión en tu cuenta de Mad Family?"
        confirmText="Sí, salir"
        cancelText="Quedarme"
      />

      <Modal 
        isOpen={modalDeleteOpen}
        onClose={() => setModalDeleteOpen(false)}
        onConfirm={confirmarClearData}
        title="¡Cuidado! ⚠️"
        message="¿Seguro que quieres borrar todos tus favoritos locales? Esta acción no se puede deshacer."
        confirmText="Sí, borrar todo"
        cancelText="Cancelar"
      />

      {/* Versión de la App */}
      <div style={{ marginTop: '40px', color: '#bbb', fontSize: '0.75rem', fontWeight: '600' }}>
        Mad Family App — Versión 1.3.0 (Community Updates) 🚀
      </div>
    </div>
  );
};

export default Perfil;