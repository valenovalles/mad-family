import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // <-- Asegúrate de mapear la ruta correcta de tu componente Modal

const Form = ({ session }) => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [resumen, setResumen] = useState('');
  const [zona, setZona] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  // 🚨 ESTADO PARA LA CONFIGURACIÓN DE TU MODAL PERSONALIZADA
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: ''
  });

  // Función ayudante para abrir la modal con el mensaje deseado
  const mostrarAlerta = (title, message) => {
    setModalConfig({
      isOpen: true,
      title,
      message
    });
  };

  // ⚠️ REGÍSTRATE EN FORMSPREE.IO (ES GRATIS), CREA UN FORMULARIO Y PEGA AQUÍ TU ID:
  const FORMSPREE_ID = "xlgvzqoy"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    // Preparación de los datos para enviar por correo
    const formData = {
      _subject: `¡Nuevo planazo chivado por ${session?.user?.email}! 🎡`,
      "Email de la Family": session?.user?.email,
      "ID de Usuario": session?.user?.id,
      "Nombre del Sitio": nombre,
      "Zona / Dirección": zona,
      "¿Por qué mola?": resumen
    };

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setExito(true);
        setNombre('');
        setResumen('');
        setZona('');
      } else {
        // Reemplazo del primer alert nativo
        mostrarAlerta(
          '¡Vaya, algo ha fallado! 😅', 
          'No hemos podido enviar el correo con tu sugerencia. Por favor, revísalo e inténtalo de nuevo, family.'
        );
      }
    } catch (error) {
      console.error("Error enviando el formulario:", error);
      // Reemplazo del segundo alert nativo (errores de red o conexión)
      mostrarAlerta(
        'Error de red 🌐', 
        'Parece que hay un problema con tu conexión a internet. Revisa tus datos o tu Wi-Fi y vuelve a intentarlo.'
      );
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '35px 25px', borderRadius: '30px', boxShadow: 'var(--shadow-soft)', maxWidth: '400px' }}>
          <span className="material-symbols-rounded" style={{ fontSize: '4rem', color: 'var(--color-main-pink)', marginBottom: '15px' }}>
            celebration
          </span>
          <h2 style={{ color: 'var(--color-text)', fontWeight: '900', margin: '0 0 10px 0' }}>¡Planazo enviado! 🥳</h2>
          <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '25px' }}>
            Ya nos ha llegado el chivatazo directito al correo. Lo revisaremos volando para añadirlo al mapa oficial. ¡Gracias, family!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%', height: '45px', backgroundColor: 'var(--color-main-blue)', color: 'white',
              border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer'
            }}
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: 'var(--color-main-pink)', fontWeight: '900', margin: '0 0 8px 0', fontSize: '1.6rem' }}>
            Chívanos un buen plan 🤫✨
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>
            ¿Has descubierto un sitio ideal con los peques que no está en la guía? ¡Compártelo con la comunidad!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white', padding: '25px', borderRadius: '25px',
          boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', gap: '18px'
        }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text)' }}>
              ¿Como se llama el sitio? *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cafetería El Columpio Azul"
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text)' }}>
              ¿Por dónde está? (Dirección o zona)
            </label>
            <input
              type="text"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Ej: Barrio del Pilar / Calle Alcalá 40"
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee',
                fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-text)' }}>
              ¿Por qué le gusta a tu family? *
            </label>
            <textarea
              required
              rows="4"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Cuéntanos un poco de su magia..."
              style={{
                width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #eee',
                fontSize: '0.9rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: '1.4'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            style={{
              width: '100%', height: '48px', backgroundColor: 'var(--color-main-blue)', color: 'white',
              border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.95rem',
              cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.05)', transition: 'transform 0.1s',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '5px'
            }}
            onMouseDown={(e) => !enviando && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => !enviando && (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span className="material-symbols-rounded">mail</span>
            {enviando ? 'Enviando correo...' : 'Chivar plan por Email'}
          </button>
        </form>
      </div>

      {/* 🎡 TU MODAL DOPAMÍNICA INYECTADA PARA ABORTAR ALERTAS NATIVAS */}
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText="Entendido"
        onConfirm={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        cancelText="Cerrar"
      />
    </div>
  );
};

export default Form;