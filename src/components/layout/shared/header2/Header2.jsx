
import './Header2.css';
import LogoGov from './img/Logo-gov.co.svg';

export const Header2 = () => {

    return (
        <div className="secondary">
            <a href="https://www.gov.co/" target="_blank" rel="noopener noreferrer">
                <img src={LogoGov} alt="Gov.co" className="logoGOV" />
            </a>
        </div>
    );

}