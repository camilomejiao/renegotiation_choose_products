import {TypeActorEnum} from "../../../../../helpers/GlobalEnum";

export const PlanInversion = ({engagement}) => {
    console.log('engagement: ', engagement);

    const img1 = "data:image/png;base64,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"
    const img2 = "data:image/png;base64,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"

    return (

        <div id="plan-inversion">
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                    <td style={{ width: '15%', textAlign: 'center', borderTop: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black' }}>
                        <img src={img1} alt="" style={{ height: '60px' }} />
                    </td>
                    <td style={{ width: '70%', borderTop: '1px solid black', textAlign: 'center' }}>
                        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <tbody>
                            <tr>
                                <td colSpan="4" style={{ borderBottom: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                    {
                                        engagement?.actividad === TypeActorEnum.COLLECTOR ?
                                            'IMPLEMENTACIÓN COMPONENTE RECOLECTORES PLAN DE ASISTENCIA CONDICIONADA PARA EMPRENDIMIENTO/COMPONENTE EMPLEABILIDAD'
                                            : 'PLAN DE INVERSIÓN PROYECTO PRODUCTIVO'
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{ borderTop: '1px solid black', borderBottom: '1px solid black', textAlign: 'center', padding: '5px' }}>SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO Y TRÁNSITO A LA LEGALIDAD</td>
                            </tr>
                            <tr>
                                <td style={{ borderRight: '1px solid black', textAlign: 'center', padding: '5px' }}>DIRECCIÓN DE SUSTITUCIÓN DE CULTIVOS DE USO ILICITO</td>
                                <td style={{ width: '15%', borderRight: '1px solid black', textAlign: 'center', padding: '5px' }}>Código:</td>
                                <td style={{ borderRight: '1px solid black', textAlign: 'center', padding: '5px' }}>Versión: preliminar</td>
                                <td style={{ textAlign: 'center', padding: '5px' }}>Fecha de publicación: preliminar</td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                    <td style={{ width: '30%', textAlign: 'center', borderTop: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black' }}>
                        <img src={img2} alt="" style={{ height: '60px' }} />
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
                        <span>
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR
                                    ? 'PLAN DE ASISTENCIA CONDICIONADA DE  EMPRENDIMIENTO'
                                    : 'PLAN DE INVERSIÓN PROYECTO PRODUCTIVO'
                            }
                        </span>
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
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR ?
                                    'PLAN DE ASISTENCIA CONDICIONADA DE  EMPRENDIMIENTO'
                                    : 'PLAN DE INVERSIÓN DEL PROYECTO PRODUCTIVO'
                            }
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
                            {
                                engagement?.detalles
                                    .reduce((total, item) => total + item.costo_total, 0)
                                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <td
                            style={{
                                borderTop: "1px solid black",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                            }}
                        >
                            OBSERVACIONES
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
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR
                                    ?
                                    `Implementación del componente de recolectores/ Programa Nacional Integral de Sustitución de Cultivos de Uso Ilícito. Corresponde a la puesta
                                            en marcha del componente dirigido a la población recolectora, en el cual se establece un plan de asistencia condicionada a la ejecución de
                                            actividades orientadas al emprendimiento y fortalecimiento de los ingresos económicos de los beneficiarios.
                                            Este plan se desarrolla mediante la adquisición de insumos, herramientas y bienes que contribuyan a impulsar iniciativas sostenibles, enmarcadas en
                                            Proyectos Productivos de carácter no agropecuario, con el propósito de promover la generación de medios de vida dignos y el desarrollo económico de la
                                            población beneficiaria en la categoría de  recolectores.
                                            La implementación de este componente deberá atender las consideraciones de orden técnico, jurídico y administrativo que garanticen la transparencia,
                                            eficiencia y sostenibilidad del proceso, asegurando que las inversiones se realicen conforme a los lineamientos establecidos por la
                                            Dirección y las normas aplicables en materia contractual, presupuestal y de control.`
                                    : engagement?.observacion
                            }
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
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR
                                    ?
                                    `NOTA 1: Obligación general sobre bienes muebles sujetos a registro. En el marco de la implementación del programa, y
                                            particularmente para los bienes muebles sujetos a registro (motocicletas, motocargueros y en general automotores), el beneficiario–recolector asume
                                            la obligación general de conservar y destinar dichos bienes exclusivamente a las actividades productivas aprobadas dentro de su plan de emprendimiento,
                                            garantizando su uso adecuado y mantenimiento durante toda la vigencia del programa. En consecuencia, el beneficiario no podrá transferir, ceder,
                                            enajenar, arrendar, ni entregar a ningún título (propiedad, posesión o tenencia)  el bien asignado a ningún tercero que no pertenezca al
                                            grupo familiar beneficiario registrado en el programa, so pena de incurrir en causal de incumplimiento del programa y de las obligaciones administrativas
                                            que se deriven de su vinculación. El bien deberá permanecer a nombre del beneficiario durante al menos cinco (5) años contados a partir de su entrega.
                                            Dicha obligación estará sujeta a seguimiento y verificación periódica por parte de la DSCI, conforme a los lineamientos técnicos, jurídicos y administrativos vigentes.
                                            Los beneficiarios–recolectores que presenten un plan de asistencia condicionada enmarcado en la línea productiva del servicio de transporte mediante vehículo automotor
                                            deberán cumplir previo a la aprobación del respectivo plan de emprendimiento, con los siguientes requisitos mínimos:
                                        REQUISITOS:
                                            i) Estar inscrito en el Registro Único Nacional de Tránsito (RUNT);
                                            ii) Presentar copia del documento de identidad vigente;
                                            iii) Acreditar paz y salvo por concepto de multas e infracciones de tránsito, así como de impuestos sobre vehículos automotores de su propiedad;
                                            iv) Contar con licencia de conducción vigente correspondiente al tipo de vehículo;
                                            v) Suscribir los formularios y documentos exigidos por el organismo de tránsito competente, de acuerdo con la normatividad aplicable.
                                            NOTA 2: El incumplimiento de uno o varios de los requisitos anteriores impedirá que el proveedor del bien mueble sujeto a registro pueda realizar la
                                            legalización del vehículo a nombre del beneficiario–recolector, circunstancia que obligará a este último a modificar su plan de asistencia condicionada o de
                                            emprendimiento, en coordinación con la entidad responsable del programa.`
                                    : engagement?.recomendacion_tecnica
                            }
                        </td>
                    </tr>
                    <tr>
                        <td
                            style={{
                                border: "1px solid black",
                            }}
                        >
                            ADMINISTRATIVOS
                        </td>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: '10px',
                                textAlign: "justify",
                            }}
                        >
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR
                                    ?
                                    `Se aclara que la atención brindada a los recolectores mediante la entrega de activos productivos de la
                                        línea no agropecuaria, alrededor de opciones de auto empleabilidad que también impactan positivamente a la comunidad,
                                        encaminadas a mejorar sus ingresos económicos, está alineada con los compromisos que constan en el Formulario de Vinculación y, consecuentemente,
                                        con los objetivos del numeral 4.1.3.6.a del Acuerdo Final para la Terminación del Conflicto y la Construcción de una Paz Estable y Duradera
                                        Por su parte, una vez realizada la entrega de los insumos señalados, se dará por terminada la ruta de atención
                                        para el/la recolector/a identificado/a con el CUB señalado en este documento dentro del Programa Nacional Integral de
                                        Sustitución de Cultivos de Uso Ilícito (PNIS); toda vez que la atención de recolectores no contempla el componente de
                                        asistencia técnica integral por parte de la DSCI. Esto, sin perjuicio de las eventuales verificaciones posteriores que,
                                        en cualquier tiempo, pueda hacer esta dependencia respecto del adecuado uso de los bienes e insumos entregados.`
                                    :
                                    `Legalizaciones: Las adquisiciones de bienes, servicios y pago de mano de obra efectuados por los beneficiarios 
                                        con cargo al valor de las transferencias deberán ser legalizados dentro de los dos
                                        (2) meses siguientes a cada uno de los desembolsos, mediante la entrega a la DSCI de las facturas
                                        documentos idóneos que comprueben la adquisición de los bienes, servicios y pago de mano de obra
                                        contemplados en los planes de inversión. Una vez se haya realizado la legalización que se habla, se
                                        iniciará el proceso de trasferencia de los saldos restantes para cada proyecto de inversión.`
                            }
                        </td>
                    </tr>
                </thead>
            </table>

            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <td
                            style={{
                                borderTop: "1px solid black",
                                borderLeft: "1px solid black",
                                borderRight: "1px solid black",
                                width: "12%"
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
                            {
                                engagement?.actividad === TypeActorEnum.COLLECTOR
                                    ?
                                    `Responsabilidades de los beneficiarios – uso y destinación de bienes:
                                        1. Responsabilidad general. Será responsabilidad exclusiva del beneficiario–recolector garantizar el buen uso, manejo, conservación y destinación 
                                        lícita de los insumos, materiales, herramientas, equipos y demás bienes entregados o adquiridos en el marco del Programa Nacional Integral de 
                                        Sustitución de Cultivos de Uso Ilícito – PNIS, de conformidad con las condiciones, objetivos y finalidades definidas en su 
                                        Plan de Asistencia Condicionada de Emprendimiento.
                                        2. Uso exclusivo de los bienes entregados. El beneficiario se obliga a utilizar los bienes entregados única y exclusivamente para el 
                                        desarrollo de las actividades previstas en el proyecto de emprendimiento aprobado.
                                        3. Prohibición de cesión o enajenación . El beneficiario deberá garantizar que los bienes se mantengan a su nombre y bajo su tenencia por un 
                                        período mínimo de tres (3) años contados a partir de la fecha de entrega (salvo el término establecido para bienes muebles sujetos a registro -vehículos automotores- 
                                        (que es de cinco (5) años) durante el cual no podrá transferirlos, enajenarlos ni cederlos a ningún título, y deberá destinarlos al 
                                        beneficio propio y de su núcleo familiar. En consecuencia, el beneficiario se abstendrá, como parte de sus obligaciones, 
                                        de realizar cualquier forma de venta, transferencia, permuta, arrendamiento, cesión o uso para fines distintos a los establecidos por el Programa. 
                                        El incumplimiento de esta obligación constituye causal de incumplimiento grave del Programa, y podrá dar lugar al retiro de este y a la recuperación del 
                                        bien o del valor equivalente, y  a las demás acciones administrativas o judiciales a que haya lugar.
                                        4. Seguimiento y control. La Dirección de Sustitución de Cultivos de Uso Ilícito (DSCI), directamente o a través del Fondo Colombia en Paz (FCP) o de las 
                                        entidades que hagan sus veces, podrá efectuar en cualquier tiempo visitas de verificación, controles aleatorios y/o periódicos, con el fin de constatar la existencia, 
                                        estado, conservación y uso adecuado de los bienes entregados, durante el término mínimo de tres (3) años o mientras dure la obligación de destinación.
                                        5. Responsabilidad penal. En caso de identificarse hechos que puedan constituir infracción o delito derivados del uso indebido de los bienes o recursos públicos, 
                                        la DSCI y el Fondo Colombia en Paz informarán a la Fiscalía General de la Nación, conforme a lo previsto en el artículo 403-A del 
                                        Código Penal Colombiano – Fraude de Subvenciones, para que adelante las acciones que estime pertinentes, sin las sanciones administrativas o fiscales a las que haya lugar.`
                                    :
                                    `Responsabilidad por falta de legalización: La no legalización de las sumas transferidas en los
                                        términos establecidos hará responsable al beneficiario o beneficiarios de todas las consecuencias
                                        legales y económicas derivadas de dicho incumplimiento, a su vez acarreará la desvinculación del
                                        Programa, la cesación de sus beneficios y la no vinculación a nuevos procesos de sustitución que
                                        implemente la DSCI. El Fondo Colombia en Paz y la DSCI pondrán en conocimiento de las autoridades
                                        competentes dicho incumplimiento.`
                            }
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
                        {
                            engagement?.actividad === TypeActorEnum.COLLECTOR
                                ?
                                `NOTA 3: Con la suscripción del presente Plan de Asistencia Condicionada de Emprendimiento, el beneficiario se obliga a cumplir las obligaciones 
                                de hacer o no hacer consignadas en el formulario de vinculación y en el presente instrumento.`
                                :
                                `Yo como titular del PNIS con la firma del presente plan de inversión acepto la modificación del
                                acuerdo individual de Sustitución, en cuanto a la renegociación de la operación de los proyectos
                                productivos, en el marco del parágrafo 5 del artículo 10 del Plan Nacional de Desarrollo "Colombia
                                Potencia de la Vida". Me comprometo bajo el principio de buena fe a dar el manejo adecuado y
                                transparente de los recursos entregados en el marco del PNIS para la ejecución del proyecto productivo.`
                        }
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
                        {
                            engagement?.actividad === TypeActorEnum.COLLECTOR
                                ?
                                `NOTA 4: De conformidad con la naturaleza de los bienes entregados y durante los términos mínimos previstos en este documento, 
                                queda prohibida cualquier forma de disposición jurídica o material sobre dichos bienes (venta, transferencia, cesión, permuta u otra), 
                                así como su uso para fines distintos a los establecidos en el plan. El beneficiario deberá asegurar su cuidado y mantenimiento. 
                                El incumplimiento de estas obligaciones dará lugar a las acciones administrativas y/o legales a que haya lugar, 
                                conforme a la normativa vigente y a los lineamientos del PNIS..`
                                :
                                `Con la suscripción del presente plan, el beneficiario se compromete a la adquisición, manejo y uso
                                de los métodos de producción, insumos y materiales requeridos de acuerdo con las especificaciones de
                                la asistencia técnica y el desarrollo de sistemas de producción que cumplan con los estándares y requisitos
                                de calidad indispensables para alcanzar un mayor grado de agro industrialización y competitividad productiva
                                y comercial.`
                        }
                    </td>
                </tr>
                </thead>
            </table>

        </div>
    )
}

