import { useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { PageNotFound } from "../../../components/layout/page404/PageNotFound";
import { RolesEnum } from "../../../helpers/GlobalEnum";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { Page } from "../../../shared/ui/page";
import { LeaderOrderReportContent } from "./LeaderOrderReportContent";
import { SupplierOrderReportContent } from "./SupplierOrderReportContent";
import {
  ContentSection,
  HeaderSection,
} from "./OrderReportPage.styles";

export const OrderReportPage = () => {
  const { userAuth } = useOutletContext();
  const allowedRoles = [
    RolesEnum.SUPPLIER,
    RolesEnum.LIDER_TECNICO_AGRO,
    RolesEnum.LIDER_TECNICO_NO_AGRO,
  ];

  const pageHeader = useMemo(
    () => ({
      title: "Órdenes de Compra",
      breadcrumbs: [
        { title: <Link to="/admin">Inicio</Link> },
        { title: "Órdenes de Compra" },
      ],
    }),
    []
  );

  const isLeaderView =
    userAuth?.rol_id === RolesEnum.LIDER_TECNICO_AGRO ||
    userAuth?.rol_id === RolesEnum.LIDER_TECNICO_NO_AGRO;

  if (!allowedRoles.includes(userAuth?.rol_id)) {
    return <PageNotFound />;
  }

  return (
    <Page showPageHeader header={pageHeader} contentPadding="0" minHeight="auto">
      <HeaderSection>
        <HeaderImage imageHeader={imgPeople} titleHeader="¡Órdenes de compra!" />
      </HeaderSection>

      <ContentSection>
        {isLeaderView ? (
          <LeaderOrderReportContent userAuth={userAuth} />
        ) : (
          <SupplierOrderReportContent />
        )}
      </ContentSection>
    </Page>
  );
};
