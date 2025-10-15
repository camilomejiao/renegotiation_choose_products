import { Tab, Tabs } from "react-bootstrap";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { BeneficiaryList } from "./beneficiaries/BeneficiaryList";
import { HeaderImage } from "../../shared/header_image/HeaderImage";

export const MenuTab = () => {

    return (
        <>
            <HeaderImage
                imageHeader={imgDCSIPeople}
                titleHeader={"¡Gestión de Usuarios Y Proveedores!"}
                bannerIcon={imgAdd}
                backgroundIconColor={"#2148C0"}
                bannerInformation={
                    "Aquí podrás realizar la entrega de todos tus productos."
                }
                backgroundInformationColor={"#F66D1F"}
            />

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
        </>
    )
}