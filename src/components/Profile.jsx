import React from 'react';

const Perfil = ({ numFavoritos }) => {
  
  const handleClearData = () => {
    if (window.confirm("¿Seguro que quieres borrar todos tus planes guardados? Esta acción no se puede deshacer.")) {
      localStorage.removeItem('mad-favoritos');
      window.location.reload(); // Recargamos para limpiar el estado
    }
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
        border: '4px solid white', boxShadow: 'var(--shadow-soft)' 
      }}>
        MF
      </div>
      
      <h2 style={{ fontWeight: '900', color: 'var(--color-text)' }}>¡Hola, Mad Family!</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Explorando Madrid con los peques desde 2026.
      </p>
      
      {/* Caja de información */}
      <div style={{ 
        backgroundColor: 'white', borderRadius: '25px', 
        padding: '25px', textAlign: 'left', boxShadow: 'var(--shadow-soft)',
        maxWidth: '400px', margin: '0 auto'
      }}>
        <p style={{ margin: '10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem'}}>location_on</span>
          Ciudad: Madrid
        </p>
        <p style={{ margin: '10px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-rounded" style={{fontSize: '1.2rem', color: 'var(--color-main-pink)'}}>favorite</span>
          Planes guardados: {numFavoritos}
        </p>
        
        <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '20px 0' }} />
        
        {/* Información sobre datos locales */}
        <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.4', marginBottom: '15px' }}>
          🔒 Tus favoritos se guardan localmente en este dispositivo.
        </p>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--color-main-blue)', fontWeight: '700', marginBottom: '20px' }}>
          🚀 Próximamente: Podrás crear tu cuenta para sincronizar tus planes en todos tus dispositivos.
        </p>

        <button 
          onClick={handleClearData}
          style={{ 
            background: 'none', border: 'none', padding: 0,
            color: '#ff4d4d', fontWeight: '800', cursor: 'pointer',
            fontSize: '0.9rem', textDecoration: 'underline'
          }}>
          Borrar mis datos guardados
        </button>
      </div>

      {/* Versión de la App */}
      <div style={{ marginTop: '40px', color: '#bbb', fontSize: '0.75rem', fontWeight: '600' }}>
        Mad Family App — Versión 1.0.0 (MVP)
      </div>
    </div>
  );
};

export default Perfil;