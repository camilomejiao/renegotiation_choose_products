import React from 'react';
import logo1 from '../../../../assets/image/header/logo-DSCI.png';

export const Header = () => {
    return (
        <header className="app-header">
            <div className="app-header__inner">
                <h1 className="app-header__title">
                    Portal de <span className="app-header__highlight">Proveedores PNIS</span>
                </h1>
                <img
                    src={logo1}
                    alt="Agencia de Renovación del Territorio"
                    className="app-header__logo"
                />
            </div>
        </header>
    );
};
