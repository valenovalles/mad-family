import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Modal from './Modal'; // <-- Asegúrate de que la ruta a tu componente Modal sea correcta

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 🧭 CONTROL DE VISTAS: 'login' | 'register' | 'forgot'
  const [vista, setVista] = useState('login'); 
  const [mensajeExito, setMensajeExito] = useState('');

  // 🚨 ESTADOS PARA CONTROLAR TU MODAL DOPAMÍNICA
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Entendido'
  });

  // Función rápida para abrir la modal configurando su contenido
  const mostrarAlerta = (title, message, confirmText = 'Entendido') => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      confirmText
    });
  };

  // Lógica de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      mostrarAlerta('¡Ups! Algo ha fallado 🔍', error.message);
    }
    setLoading(false);
  };

  // Lógica de Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      mostrarAlerta('No se pudo crear la cuenta 📋', error.message);
    } else {
      mostrarAlerta(
        '¡Revisa tu correo! 📬', 
        'Te hemos enviado un enlace mágico a tu email para confirmar la cuenta familiar y empezar la aventura.'
      );
    }
    setLoading(false);
  };

  // 📨 ENVIAR EMAIL DE RECUPERACIÓN
  const handleRecuperarPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      return mostrarAlerta('Falta el email ✉️', 'Por favor, introduce tu email familiar para continuar.');
    }
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/perfil`, 
    });

    setLoading(false);
    if (error) {
      mostrarAlerta('Error de recuperación ❌', error.message);
    } else {
      setMensajeExito('¡Chivatazo enviado! Revisa tu email para restablecer tu contraseña. 📬✨');
      setTimeout(() => {
        setMensajeExito('');
        setVista('login'); // Le devolvemos al login automáticamente
      }, 5000);
    }
  };

  // --- VISTA 1: OLVIDÉ MI CONTRASEÑA ---
  if (vista === 'forgot') {
    return (
      <div style={{ textAlign: 'left', fontFamily: 'inherit' }}>
        <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', color: 'var(--color-text)', fontSize: '1.1rem' }}>
          ¿Se te ha olvidado la clave? 🔍
        </h3>
        <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: '1.4', margin: '0 0 20px 0' }}>
          No pasa nada, family. Pon tu correo aquí abajo y te mandamos un enlace mágico para poner una nueva al instante.
        </p>

        {mensajeExito ? (
          <div style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '15px', lineHeight: '1.4' }}>
            {mensajeExito}
          </div>
        ) : (
          <form onSubmit={handleRecuperarPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="email"
              required
              placeholder="Email de la family"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
            <button type="submit" disabled={loading} style={{ width: '100%', height: '44px', backgroundColor: 'var(--color-main-blue)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.05)' }}>
              {loading ? 'Enviando enlace...' : 'Recuperar contraseña'}
            </button>
          </form>
        )}

        <button 
          onClick={() => setVista('login')}
          style={{ background: 'none', border: 'none', color: 'var(--color-main-pink)', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', marginTop: '15px', padding: 0, textDecoration: 'underline' }}
        >
          Volver a iniciar sesión
        </button>

        {/* Renderizado de la Modal */}
        <Modal 
          isOpen={modalConfig.isOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          onConfirm={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          cancelText="Cerrar"
        />
      </div>
    );
  }

  // --- VISTA 2: LOGIN Y REGISTRO TRADICIONAL ---
  return (
    <div style={{ textAlign: 'left', fontFamily: 'inherit' }}>
      <form onSubmit={vista === 'login' ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <h3 style={{ margin: '0', fontWeight: '900', color: 'var(--color-text)', fontSize: '1.1rem' }}>
          {vista === 'login' ? '¡Hola de nuevo!' : 'Crear cuenta familiar'}
        </h3>

        <input
          type="email"
          required
          placeholder="Email de la family"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
        />
        
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
        />

        {/* 🔗 ENLACE DE OLVIDÓ CONTRASEÑA */}
        {vista === 'login' && (
          <div style={{ textAlign: 'right', marginTop: '-5px' }}>
            <span 
              onClick={() => setVista('forgot')}
              style={{ color: '#999', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ¿Olvidaste la contraseña?
            </span>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ width: '100%', height: '44px', backgroundColor: 'var(--color-main-blue)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', marginTop: '5px' }}>
          {loading ? 'Procesando...' : vista === 'login' ? 'Entrar a la guía' : 'Registrar mi family'}
        </button>
      </form>

      {/* Alternar entre Login y Registro */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button 
          onClick={() => setVista(vista === 'login' ? 'register' : 'login')}
          style={{ background: 'none', border: 'none', color: 'var(--color-main-pink)', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
        >
          {vista === 'login' ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>

      {/* 🎡 LA MODAL INTEGRADA AL FINAL DE LA VISTA PRINCIPAL */}
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        onConfirm={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        cancelText="Cerrar"
      />
    </div>
  );
};

export default Auth;