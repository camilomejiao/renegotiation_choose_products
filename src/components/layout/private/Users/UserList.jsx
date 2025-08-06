import {Tab, Tabs} from "react-bootstrap";
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

export const UserList = () => {

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Usuarios!</h1>
                    </div>
                </div>

                <div className="content container">
                    <Tabs
                        defaultActiveKey="profile"
                        id="justify-tab-example"
                        className="mb-3"
                        justify
                    >
                        <Tab eventKey="users" title="USUARIOS DEL SISTEMA">
                            Tab content for Users
                        </Tab>
                        <Tab eventKey="suppliers" title="PROVEEDORES">
                            Tab content for Suppliers
                        </Tab>
                        <Tab eventKey="beneficiaries" title="BENEFICIARIOS">
                            Tab content for Beneficiaries
                        </Tab>
                    </Tabs>
                </div>

            </div>
            );
        </>
    )
}