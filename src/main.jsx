import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// 1️⃣ Importamos el proveedor
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2️⃣ Envolvemos la App con él */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);