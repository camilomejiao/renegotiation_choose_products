import React from 'react';
import { FaBars } from 'react-icons/fa';
import logo1 from '../../../../assets/image/header/logo-DSCI.png';

export const Header = ({ isMobile = false, isSidebarOpen = false, onMenuToggle }) => {
    return (
        <header className="header gov-header">
            <div className="header-main">
                <button
                    type="button"
                    className="header-menu-toggle"
                    onClick={onMenuToggle}
                    aria-label={isSidebarOpen ? 'Cerrar menu' : 'Abrir menu'}
                    aria-expanded={isSidebarOpen}
                >
                    <FaBars />
                </button>
                <div className="logo">
                    <span>Portal</span>
                    <span className="text-success">PNIS</span>
                </div>
            </div>
            <div className="user-info">
                <img
                    src={logo1}
                    alt="Agencia de Renovacion del Territorio"
                    style={{ height: isMobile ? '40px' : '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
                />
            </div>
        </header>
    );
};
