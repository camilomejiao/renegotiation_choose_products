import imgPayments from "../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../assets/image/payments/imgPay.png";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";

export const AdminManagementHero = () => {
  return (
    <HeaderImage
      imageHeader={imgPayments}
      titleHeader="Gestión de usuarios"
      bannerIcon={imgAdd}
      backgroundIconColor="#2148C0"
      bannerInformation="Aquí podrás ver el listado de usuarios del sistema."
      backgroundInformationColor="#40A581"
    />
  );
};
