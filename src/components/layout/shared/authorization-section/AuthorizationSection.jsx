import { useRef, useState } from "react";
import Select from "react-select";
import { Col, Container, Row } from "react-bootstrap";
import printJS from "print-js";

//Img
import imgFrame1 from "../../../../assets/image/icons/frame.png";

//Css
import './AuthorizationSection.css';

//
import { Authorization } from "./authorization/Authorization";
import AlertComponent from "../../../../helpers/alert/AlertComponent";

//Enum
import { ComponentEnum } from "../../../../helpers/GlobalEnum";

export const AuthorizationSection = ({component, userData, wide}) => {

    //
    const authorizationRef = useRef();

    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');

    const options = [
        'Imposibilidad jurídica',
        'Imposibilidad fáctica',
        'Mayor impacto productivo',
        //'Otros componentes no incluidos en el plan de inversión'
    ];

    // Función para validar si se ha seleccionado al menos una opción
    const isValidSelection = () => {
        return (
            (option1 && option1.value && option1.value.trim() !== '') ||
            (option2 && option2.value && option2.value.trim() !== '') ||
            (option3 && option3.value && option3.value.trim() !== '')
        );
    };

    //Imprime la autorización del usuario
    const handlePrintAuthorization = () => {
        if (component === ComponentEnum.RENEGOTIATION && !isValidSelection()) {
            AlertComponent.warning("","Debes seleccionar al menos una opción antes de continuar.");
            return;
        }

        const printContent = `
        <html>
        <head>
          <style>           
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              font-size: 12px;
            }           
          </style>
        </head>
        <body>
          <!-- Inyectamos el HTML del componente -->
          ${authorizationRef.current.innerHTML} 
        </body>
        </html>`;

        printJS({
            printable: printContent,
            type: 'raw-html',
            documentTitle: 'Autorización Plan de Inversión',
        });
    }

    return (
        <>
            <Container>
                <Row className="justify-content-start">
                    <Col md={wide}>
                        <div className="authorization-options">
                            <h4 style={{ fontWeight: "bold", fontSize: "18px", color: "#2148C0", textAlign: "center" }}>
                                Selecciona las opciones para la autorización:
                            </h4>
                            <p style={{ fontWeight: "bold", fontSize: "10px", color: "#2148C0", textAlign: "left" }}>
                                Que la presente solicitud de actualización se fundamenta en:
                            </p>
                            <Select
                                value={option1}
                                onChange={setOption1}
                                options={options.map((opt) => ({ value: opt, label: opt }))}
                                placeholder="Selecciona la primera opción"
                                classNamePrefix="custom-select"
                                className="custom-select"
                            />
                            <Select
                                value={option2}
                                onChange={setOption2}
                                options={options.map((opt) => ({ value: opt, label: opt }))}
                                placeholder="Selecciona la segunda opción"
                                classNamePrefix="custom-select"
                                className="custom-select"
                            />
                            <Select
                                value={option3}
                                onChange={setOption3}
                                options={options.map((opt) => ({ value: opt, label: opt }))}
                                placeholder="Selecciona la tercera opción"
                                classNamePrefix="custom-select"
                                className="custom-select"
                            />
                        </div>
                    </Col>
                </Row>
                <Row className="justify-content-start mt-4 mb-4">
                    <Col md={wide}>
                        <button onClick={handlePrintAuthorization} className="autorization-button general">
                            <img src={imgFrame1} alt="icono general" className="button-icon" />
                            AUTORIZACIÓN
                        </button>
                    </Col>
                </Row>
            </Container>

            <div style={{ display: "none" }}>
                <div ref={authorizationRef}>
                    <Authorization component={component} userData={userData} opt1={option1} opt2={option2} opt3={option3} />
                </div>
            </div>
        </>
    )
}
