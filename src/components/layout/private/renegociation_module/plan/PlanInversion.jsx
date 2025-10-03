export const PlanInversion = ({engagement}) => {

    const img2 = "data:image/png;base64,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";

    return (

        <div id="plan-inversion">
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                        }}
                    >
                        <img src={''} alt="" style={{ height: "60px" }} />
                    </td>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "right",
                            borderTop: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        <img src={img2} alt="" style={{ height: "60px" }} />
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        style={{
                            textAlign: "center",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        <span>PLAN DE INVERSIÓN PROYECTO PRODUCTIVO</span>
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        FECHA: {engagement?.fecha}
                    </td>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Cédula: {engagement?.identificacion}
                    </td>
                    <td
                        style={{
                            width: "30%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Nombre: {`${engagement?.nombre} ${engagement?.apellido}` }
                    </td>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Cub: {engagement?.id}
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Departamento: {engagement?.departamento}
                    </td>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Municipio: {engagement?.municipio}
                    </td>
                    <td
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Vereda: {engagement?.vereda}
                    </td>
                </tr>
                <tr>
                    <td
                        colSpan="4"
                        style={{
                            width: "15%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        Restricción: {engagement?.restriccion}
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        style={{
                            width: "20%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        PLAN: {engagement?.plan}
                    </td>
                    <td
                        style={{
                            width: "80%",
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        LINEA: {engagement?.linea}
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td style={{ textAlign: "center", border: "1px solid black" }}>
                        PLAN DE INVERSIÓN DEL PROYECTO PRODUCTIVO
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th
                        style={{
                            width: "10%",
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        CÓDIGO
                    </th>
                    <th
                        style={{
                            width: "50%",
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        DESCRIPCIÓN
                    </th>
                    <th
                        style={{
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        UNIDAD
                    </th>
                    <th
                        style={{
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        CANTIDAD
                    </th>
                    <th
                        style={{
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        COSTO UNITARIO
                    </th>
                    <th
                        style={{
                            textAlign: "center",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        COSTO TOTAL
                    </th>
                </tr>
                </thead>
                <tbody>
                    {engagement?.detalles.map((item, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: "center", border: "1px solid black" }}>{item.codigo}</td>
                            <td style={{ textAlign: "left", border: "1px solid black", padding: "5px" }}>{item.descripcion}</td>
                            <td style={{ textAlign: "center", border: "1px solid black" }}>{item.unidad}</td>
                            <td style={{ textAlign: "center", border: "1px solid black" }}>{item.cantidad}</td>
                            <td style={{ textAlign: "right", border: "1px solid black", paddingRight: "10px" }}>
                                {parseFloat(item.costo_unitario).toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                })}
                            </td>
                            <td style={{ textAlign: "right", border: "1px solid black", paddingRight: "10px" }}>
                                {item.costo_total.toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                })}
                            </td>
                        </tr>
                    ))}
                    {/* Fila Total */}
                    <tr>
                        <td colSpan="5"
                            style={{
                                textAlign: "right",
                                fontWeight: "bold",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                                padding: "5px"
                        }}>
                            Total
                        </td>
                        <td
                            style={{
                                textAlign: "right",
                                fontWeight: "bold",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                                paddingRight: "10px"
                        }}>
                            {engagement?.detalles
                                .reduce((total, item) => total + item.costo_total, 0)
                                .toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        colSpan="2"
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        OBSERVACIONES: {engagement?.observacion}
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        TECNICAS
                    </td>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            padding: '10px',
                            textAlign: "justify",
                        }}
                    >
                        {engagement?.recomendacion_tecnica}
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        ADMINISTRATIVOS
                    </td>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            padding: '10px',
                            textAlign: "justify",
                        }}
                    >
                        Legalizaciones: Las adquisiciones de bienes, servicios y pago de mano de obra efectuados por los
                        beneficiarios con cargo al valor de las transferencias deberán ser legalizados dentro de los dos
                        (2) meses siguientes a cada uno de los desembolsos, mediante la entrega a la DSCI de las facturas y
                        documentos idóneos que comprueben la adquisición de los bienes, servicios y pago de mano de obra
                        contemplados en los planes de inversión. Una vez se haya realizado la legalización que se habla, se
                        iniciará el proceso de trasferencia de los saldos restantes para cada proyecto de inversión.
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        JURÍDICA
                    </td>
                    <td
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            padding: '10px',
                            textAlign: "justify",
                        }}
                    >
                        Responsabilidad por falta de legalización: La no legalización de las sumas transferidas en los
                        términos establecidos hará responsable al beneficiario o beneficiarios de todas las consecuencias
                        legales y económicas derivadas de dicho incumplimiento, a su vez acarreará la desvinculación del
                        Programa, la cesación de sus beneficios y la no vinculación a nuevos procesos de sustitución que
                        implemente la DSCI. El Fondo Colombia en Paz y la DSCI pondrán en conocimiento de las autoridades
                        competentes dicho incumplimiento.
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        height="50px"
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        &nbsp;
                    </td>
                    <td style={{ borderRight: "1px solid black", borderTop: "1px solid black" }}>
                        &nbsp;
                    </td>
                    <td
                        colSpan="5"
                        style={{
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            textAlign: "center",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        FIRMA TITULAR
                    </td>
                    <td style={{ borderRight: "1px solid black" }}>&nbsp;</td>
                    <td
                        colSpan="5"
                        style={{
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        No. CÉDULA:  {engagement?.identificacion}
                    </td>
                    <td style={{ borderRight: "1px solid black" }}>&nbsp;</td>
                    <td
                        colSpan="5"
                        style={{
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        &nbsp;
                    </td>
                </tr>
                <tr>
                    <td
                        style={{
                            textAlign: "left",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        TELÉFONO: {engagement?.telefono}
                    </td>
                    <td
                        style={{
                            textAlign: "center",
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                        }}
                    >
                        HUELLA
                    </td>
                    <td style={{ borderLeft: "1px solid black" }}>&nbsp;</td>
                    <td
                        style={{
                            textAlign: "center",
                            borderTop: "1px solid black",
                        }}
                    >
                        Nombre Técnico de campo
                    </td>
                    <td>&nbsp;</td>
                    <td
                        style={{
                            textAlign: "center",
                            borderTop: "1px solid black",
                        }}
                    >
                        Firma Técnico de campo
                    </td>
                    <td style={{ borderRight: "1px solid black" }}>&nbsp;</td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td
                        style={{
                            padding: '10px',
                            borderTop: "1px solid black",
                            borderLeft: "1px solid black",
                            borderRight: "1px solid black",
                            textAlign: "justify",
                        }}
                    >
                        Yo como titular del PNIS con la firma del presente plan de inversión acepto la modificación del
                        acuerdo individual de Sustitución, en cuanto a la renegociación de la operación de los proyectos
                        productivos, en el marco del parágrafo 5 del artículo 10 del Plan Nacional de Desarrollo "Colombia
                        Potencia de la Vida". Me comprometo bajo el principio de buena fe a dar el manejo adecuado y
                        transparente de los recursos entregados en el marco del PNIS para la ejecución del proyecto productivo.
                    </td>
                </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <td style={{
                        border: "1px solid black",
                        padding: '10px',
                        textAlign: "justify",
                    }}>
                        Con la suscripción del presente plan, el beneficiario se compromete a la adquisición, manejo y uso
                        de los métodos de producción, insumos y materiales requeridos de acuerdo con las especificaciones de
                        la asistencia técnica y el desarrollo de sistemas de producción que cumplan con los estándares y requisitos
                        de calidad indispensables para alcanzar un mayor grado de agro industrialización y competitividad productiva
                        y comercial.
                    </td>
                </tr>
                </thead>
            </table>

        </div>
    )
}