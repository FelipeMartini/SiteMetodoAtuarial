"use client";

import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          color: '#1f2937',
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Entrar no Sistema
        </h1>

        <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Sistema de Dashboard Administrativo
        </p>

        <button
          onClick={() => window.location.href = '/api/auth/signin/google'}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          🚀 Entrar com Google
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a
            href="/"
            style={{ color: '#4f46e5', textDecoration: 'none' }}
          >
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
