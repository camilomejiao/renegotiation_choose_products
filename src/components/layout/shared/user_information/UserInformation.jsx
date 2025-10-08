import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";

const detailsConfig = [
    { key: "departamento", label: "Departamento" },
    { key: "municipio", label: "Municipio" },
    { key: "vereda", label: "Vereda" },
    { key: "estado_cub", label: "Estado" },
    { key: "actividad", label: "Actividad" },
    { key: "tipo", label: "Tipo de persona" },
    { key: "telefono", label: "Teléfono" },
    { key: "plan", label: "Plan" },
    { key: "linea", label: "Línea" },
    { key: "restriccion", label: "Restricción" },
    { key: "etnico", label: "Etnia" },
    { key: "observaciones", label: "Observaciones" },
];

export const UserInformation = ({ userData = {} }) => {
    const nombre = [userData?.nombre, userData?.apellido].filter(Boolean).join(" ");

    const entries = detailsConfig
        .map(({ key, label }) => ({ label, value: userData?.[key] }))
        .filter(({ value }) => value !== undefined && value !== null && value !== "");

    return (
        <section className="surface-card profile-card">
            <div className="profile-card__header">
                <img src={imgAdd} alt="Icono Usuario" className="profile-card__avatar" />

                <div className="profile-card__identity">
                    <div className="profile-card__name">
                        <strong>Nombre:</strong>
                        <span>{nombre || "No disponible"}</span>
                    </div>

                    <div className="profile-card__meta">
                        <strong>C.C:</strong>
                        <span>{userData?.identificacion || "—"}</span>
                        <strong>CUB:</strong>
                        <span>{userData?.cub_id || "—"}</span>
                    </div>
                </div>
            </div>

            {entries.length > 0 && (
                <div className="profile-card__grid">
                    {entries.map(({ label, value }) => (
                        <div key={label} className="profile-card__item">
                            <span className="profile-card__label">{label}</span>
                            <span className="profile-card__value">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
