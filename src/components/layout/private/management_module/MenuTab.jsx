import { Tab, Tabs } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import managementIcon from "../../../../assets/image/icons/frame.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { BeneficiaryList } from "./beneficiaries/BeneficiaryList";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import { ModernBanner } from "../../../shared/ModernBanner";

export const MenuTab = () => {

    return (
        <>
            <Breadcrumb />
            <div className="container-fluid px-4">
                <ModernBanner
                    imageHeader={imgDCSIPeople}
                    titleHeader="​"
                    bannerIcon={managementIcon}
                    bannerInformation="Gestión de Usuarios"
                    backgroundInformationColor="#2148C0"
                    infoText="Administra usuarios del sistema, proveedores y beneficiarios desde un panel centralizado."
                />

                <div className="mb-4">
                    <h3 className="text-primary fw-bold mb-3">
                        <FaUsers className="me-2" />
                        Panel de Administración
                    </h3>
                </div>

                <Tabs
                    defaultActiveKey="users"
                    id="management-tabs"
                    className="mb-4"
                    justify
                >
                    <Tab eventKey="users" title="USUARIOS DEL SISTEMA">
                        <UserList />
                    </Tab>
                    <Tab eventKey="suppliers" title="PROVEEDORES">
                        <SupplierList />
                    </Tab>
                    <Tab eventKey="beneficiaries" title="BENEFICIARIOS">
                        <BeneficiaryList />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}