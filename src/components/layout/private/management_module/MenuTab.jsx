import { useMemo, useState } from "react";
import { Card, Tabs } from "antd";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

//Img
import imgPayments from "../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Components
import { UserList } from "./user/UserList";
import { SupplierList } from "./suppliers/SupplierList";
import { HeaderImage } from "../../shared/header_image/HeaderImage";
import { Page } from "../../../../shared/ui/page";

export const MenuTab = () => {
    const [activeKey, setActiveKey] = useState("users");
    const currentSectionLabel = activeKey === "suppliers" ? "Proveedores" : "Usuarios";
    const pageHeader = useMemo(
        () => ({
            title: "Administración",
            breadcrumbs: [
                { title: <Link to="/admin">Inicio</Link> },
                { title: "Administración" },
                { title: currentSectionLabel },
            ],
        }),
        [currentSectionLabel]
    );

    return (
        <Page
            showPageHeader
            header={pageHeader}
            contentPadding="0"
            minHeight="auto"
            headerPaddingTop="36px"
            headerMarginBottom="12px"
        >
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Gestión de usuarios'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el listado de usuarios del sistema.'}
                backgroundInformationColor={'#40A581'}
            />

            <TabsContainer>
                <TabsCard>
                    <Tabs
                        activeKey={activeKey}
                        onChange={(key) => setActiveKey(key)}
                        items={[
                            {
                                key: "users",
                                label: "USUARIOS DEL SISTEMA",
                                children: <UserList />,
                            },
                            {
                                key: "suppliers",
                                label: "PROVEEDORES",
                                children: <SupplierList />,
                            },
                        ]}
                    />
                </TabsCard>
            </TabsContainer>
        </Page>
    )
}

const TabsContainer = styled.section`
  padding: 40px 24px 24px;
  display: grid;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 24px 12px 12px;
  }
`;

const TabsCard = styled(Card)`
  && {
    border-radius: 20px;
    border: 1px solid #dbe4f0;
    box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  }
`;
