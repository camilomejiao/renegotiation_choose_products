import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

//css
import './Dashboard.css';

//Component
import { Footer } from "../../shared/footer/Footer";
import { SearchUserForm } from "../search-user-form/SearchUserForm";
import { LocationModal } from "../../shared/Modals/LocationModal";

//Enums
import { ResponseStatusEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

//Services
import { supplierServices } from "../../../../helpers/services/SupplierServices";

export const Dashboard = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [municipalities, setMunicipalities] = useState([]);
    const [showModal, setShowModal] = useState(false);

    //
    const getSupplierLocation = () => {
        const { locationName, location_id} = supplierServices.getLocation();
        if (locationName && location_id) {
            //console.log('Ubicación ya configurada:', { locationName, location_id });
            setShowModal(false);
        } else {
            getSupplierInfo();
            setShowModal(true);
        }
    };

    //
    const getSupplierInfo = async () => {
        try {
            const { data, status } = await supplierServices.getInfoSupplier();
            if (status === ResponseStatusEnum.OK) {
                const muni = Object.entries(data.municipios).map(([key, value]) => {
                    const [code, name] = value.split(" : ").map(str => str.trim());
                    return {
                        value: parseInt(code),
                        label: name,
                        codeMuni: code
                    };
                });
                setMunicipalities(muni);
            }
        } catch (error) {
            console.error("Error fetching supplier info:", error);
        }
    };

    //
    const saveSupplierLocation = (selectedLocation) => {
        supplierServices.saveLocationToLocalStorage(selectedLocation.value, selectedLocation.label);
        setShowModal(false);
    };

    //
    const handleSearchSuccess = (userData) => {
        const { id } = userData;

        userAuth.rol_id === RolesEnum.SUPPLIER
            ? navigate(`/admin/create-order/${id}`)
            : navigate(`/admin/reports/${id}`);
    };

    useEffect(() => {
        if(userAuth.rol_id === RolesEnum.SUPPLIER) {
            getSupplierLocation()
        }
    }, []);

    return (
        <>

            <Container fluid className="dashboard-container">
                <Row className="text-center mt-5">
                    <Col>
                        <h1 className="dashboard-title">
                            Bienvenido al <span className="highlight-text">banco de <br/>Proveedores</span> de la DSCI
                        </h1>
                        <p className="green-box">
                            Da el siguiente paso en tus <span className="highlight-text2">ventas</span> ahora.
                        </p>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-4">
                    <SearchUserForm onSearchSuccess={handleSearchSuccess} />
                </Row>

                <Footer />
            </Container>

            <LocationModal
                show={showModal}
                optionsArray={municipalities}
                onConfirm={saveSupplierLocation}
            />

        </>
    );
}