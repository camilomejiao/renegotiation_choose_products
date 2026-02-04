import React from 'react';
import logo1 from '../../../../assets/image/header/logo-DSCI.png';

export const Header = () => {
    return (
        <header className="header gov-header">
            <div className="logo">
                <span>Portal</span>
                <span className="text-success">PNIS</span>
            </div>
            <div className="user-info">
                <img
                    src={logo1}
                    alt="Agencia de Renovación del Territorio"
                    style={{ height: '50px', filter: 'brightness(0) invert(1)' }}
                />
            </div>
        </header>
    );
};
