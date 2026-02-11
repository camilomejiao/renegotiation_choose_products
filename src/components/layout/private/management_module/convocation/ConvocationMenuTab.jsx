import {useNavigate, useParams} from "react-router-dom";
import {Tab, Tabs} from "react-bootstrap";

//Img
import imgDCSIPeople from "../../../../../assets/image/addProducts/imgDSCIPeople.png";

//Components
import { Suppliers } from "./Suppliers";
import { Location } from "./Location";
import { General } from "./General";
import {useState} from "react";
import imgPayments from "../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../assets/image/payments/imgPay.png";
import {HeaderImage} from "../../../shared/header_image/HeaderImage";
import { Loading } from "../../../shared/loading/Loading";

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
        }, 1000);
    }

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Creacion de jornadas'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
            />

            {loading && <Loading text="Cargando..." />}

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
        </>
    );
};

