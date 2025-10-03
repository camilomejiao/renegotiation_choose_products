import { Tab, Tabs } from "react-bootstrap";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { BeneficiaryList } from "./beneficiaries/BeneficiaryList";

export const MenuTab = () => {

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Gestión de Usuarios!</h1>
                    </div>
                </div>

                <div className="container mt-5">
                    <Tabs
                        defaultActiveKey="users"
                        id="justify-tab-example"
                        className="mb-3"
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

            </div>
            );
        </>
    )
}