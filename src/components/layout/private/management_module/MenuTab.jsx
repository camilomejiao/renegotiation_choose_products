import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

//Img
import imgPayments from "../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { HeaderImage } from "../../shared/header_image/HeaderImage";
import "./ManagementMobileFix.css";

export const MenuTab = () => {
    const [activeKey, setActiveKey] = useState("users");

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 80);

        return () => clearTimeout(timer);
    }, [activeKey]);

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
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k || "users")}
                    id="justify-tab-example"
                    className="mb-3 management-tabs"
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
