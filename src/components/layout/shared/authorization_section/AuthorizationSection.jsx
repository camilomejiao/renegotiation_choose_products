import { useRef, useState } from "react";
import Select from "react-select";
import printJS from "print-js";

import imgFrame1 from "../../../../assets/image/icons/frame.png";
import { Authorization } from "./authorization/Authorization";
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import { ComponentEnum } from "../../../../helpers/GlobalEnum";

const selectOptions = [
    "Imposibilidad jurídica",
    "Imposibilidad fáctica",
    "Mayor impacto productivo",
];

const buildOptionList = () => selectOptions.map((opt) => ({ value: opt, label: opt }));

export const AuthorizationSection = ({ component, userData, wide }) => {
    const authorizationRef = useRef();

    const [option1, setOption1] = useState(null);
    const [option2, setOption2] = useState(null);
    const [option3, setOption3] = useState(null);

    const isValidSelection = () => [option1, option2, option3].some((opt) => opt?.value?.trim());

    const handlePrintAuthorization = () => {
        if (component === ComponentEnum.RENEGOTIATION && !isValidSelection()) {
            AlertComponent.warning("", "Debes seleccionar al menos una opción antes de continuar.");
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
          ${authorizationRef.current.innerHTML}
        </body>
        </html>`;

        printJS({
            printable: printContent,
            type: "raw-html",
            documentTitle: "Autorización Plan de Inversión",
        });
    };

    const widthPercent = wide ? `${(wide / 12) * 100}%` : "100%";

    return (
        <>
            <div className="authorization-wrapper" style={{ width: "100%", maxWidth: widthPercent }}>
                <section className="surface-card form-section authorization-panel">
                    <header className="form-section__header">
                        <h4 className="form-section__title">Selecciona las opciones para la autorización</h4>
                        <p className="form-section__subtitle">
                            Que la presente solicitud de actualización se fundamenta en:
                        </p>
                    </header>

                    <div className="select-stack">
                        <Select
                            value={option1}
                            onChange={setOption1}
                            options={buildOptionList()}
                            placeholder="Selecciona la primera opción"
                            classNamePrefix="auth-select"
                        />
                        <Select
                            value={option2}
                            onChange={setOption2}
                            options={buildOptionList()}
                            placeholder="Selecciona la segunda opción"
                            classNamePrefix="auth-select"
                        />
                        <Select
                            value={option3}
                            onChange={setOption3}
                            options={buildOptionList()}
                            placeholder="Selecciona la tercera opción"
                            classNamePrefix="auth-select"
                        />
                    </div>
                </section>

                <button onClick={handlePrintAuthorization} className="button-pill authorization-button">
                    <img src={imgFrame1} alt="Icono autorización" width="26" height="26" />
                    Autorización
                </button>
            </div>

            <div style={{ display: "none" }}>
                <div ref={authorizationRef}>
                    <Authorization
                        component={component}
                        userData={userData}
                        opt1={option1}
                        opt2={option2}
                        opt3={option3}
                    />
                </div>
            </div>
        </>
    );
};
