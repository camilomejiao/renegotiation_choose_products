import { Tab, Tabs } from "react-bootstrap";

//Img
import imgPayments from "../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { HeaderImage } from "../../shared/header_image/HeaderImage";

export const MenuTab = () => {

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Gestión de usuarios'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
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
                </Tabs>
            </div>
        </>
    )
}
