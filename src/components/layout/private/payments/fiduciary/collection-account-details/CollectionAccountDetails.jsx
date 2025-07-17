
//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";


//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";


export const CollectionAccountDetails = () => {

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Fiduciara'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás ver el lisatdo de cuentas de cobro.'}
                backgroundInformationColor={'#40A581'}
            />

        </>
    )
}