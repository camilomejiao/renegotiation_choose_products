import {useNavigate, useParams} from "react-router-dom";
import {Spinner, Tab, Tabs} from "react-bootstrap";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

//Components
import { Suppliers } from "./Suppliers";
import { Location } from "./Location";
import { General } from "./General";
import {useState} from "react";

export const ConvocationMenuTab = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const onBack = () => {
        navigate('/admin/list-convocation');
    }

    const refreshPage = () => {
        setLoading(true);
        setTimeout(() => {
            window.location.reload();
            setLoading(false);
        }, 2000);
    }

    return (
        <div className="main-container">
            <div className="header-image position-relative">
                <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                <div className="overlay-text position-absolute w-100 text-center">
                    <h1>¡Creación de Jornadas!</h1>
                </div>
            </div>

            {loading && (
                <div className="spinner-container">
                    <Spinner animation="border" variant="success" />
                    <span>Cargando...</span>
                </div>
            )}

            <div className="container mt-5">
                <Tabs
                    defaultActiveKey="create"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                    mountOnEnter
                    unmountOnExit
                >
                    <Tab eventKey="create"
                         title="GENERAL"
                        tabClassName={'text-success'}
                    >
                        <General id={id} onBack={onBack} />
                    </Tab>

                    <Tab eventKey="location"
                         title="UBICACIONES"
                         disabled={!id}
                         tabClassName={!id ? 'text-danger' : 'text-success'}
                    >
                        <Location id={id} onBack={onBack} refreshPage={refreshPage} />
                    </Tab>

                    <Tab eventKey="suppliers"
                         title="PROVEEDORES"
                         disabled={!id}
                         tabClassName={!id ? 'text-danger' : 'text-success'}
                    >
                        <Suppliers id={id} onBack={onBack} refreshPage={refreshPage} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};
