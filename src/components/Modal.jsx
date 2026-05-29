import React from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(4px)', // Desenfoca lo que hay detrás, queda finísimo
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '30px',
        padding: '30px 25px',
        maxWidth: '360px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Icono decorativo */}
        <div style={{
          width: '60px', height: '60px',
          backgroundColor: 'var(--color-bg-cream)',
          borderRadius: '50%', margin: '0 auto 15px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span className="material-symbols-rounded" style={{ color: 'var(--color-main-pink)', fontSize: '2rem' }}>
            error
          </span>
        </div>

        <h3 style={{ margin: '0 0 10px 0', fontWeight: '900', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {title}
        </h3>
        
        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 25px 0' }}>
          {message}
        </p>

        {/* Botones de acción dopamínicos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={onConfirm}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: 'var(--color-main-pink)', color: 'white',
              border: 'none', borderRadius: '16px',
              fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 0 rgba(0,0,0,0.05)'
            }}
          >
            {confirmText}
          </button>
          
          <button 
            onClick={onClose}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: 'transparent', color: 'var(--color-main-blue)',
              border: '2px solid var(--color-main-blue)', borderRadius: '16px',
              fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>

      {/* Mini animación CSS inyectada para el efecto de rebote */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </div>
  );
}