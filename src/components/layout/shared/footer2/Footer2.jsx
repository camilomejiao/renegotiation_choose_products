
import { dataFooter, dataSocial, dataNormativas, enlacesInteres } from "./dataFooter";
import './Footer2.css';

export const Footer2 = () => {

    return (
        <div className="footer-bottom">
            <div className="footer-card">
                <div className="footer-card-content">
                    {/* Información principal */}
                    <h3>{dataFooter.title}</h3>
                    <p>{dataFooter.address}</p>
                    <p className="email-support">{dataFooter.email}</p>
                    <p>{dataFooter.phone}</p>

                    {/* Redes sociales */}
                    <div className="social-media-links">
                        {dataSocial.map((item, index) => (
                            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.img} alt="" />
                            </a>
                        ))}
                    </div>
                    <br />

                    {/* Enlaces de interés */}
                    <h3>Enlaces de interés por territorial</h3>
                    <div className="enlacs-interes mt-1 mb-4">
                        {enlacesInteres.map((item, index) => (
                            <a key={index} href={item.url}>
                                {item.name}
                            </a>
                        ))}
                    </div>

                    {/* Normatividad */}
                    <div className="footer-links">
                        {dataNormativas.map((item, index) => (
                            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}