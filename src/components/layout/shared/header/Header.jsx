import React from 'react';
import logo1 from '../../../../assets/image/header/logo-DSCI.png';

export const Header = () => {
    return (
        <header style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '80px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <h1 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'white'
                }}>
                    Portal de <span style={{color: '#059669'}}>Proveedores PNIS</span>
                </h1>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <img src={logo1} alt="Agencia de Renovación del Territorio" style={{
                    height: '50px',
                    filter: 'brightness(0) invert(1)'
                }} />
            </div>
        </header>
    );
};
