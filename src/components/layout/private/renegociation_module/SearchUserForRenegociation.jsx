import { useNavigate } from "react-router-dom";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Components
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { HeaderImage } from "../../shared/header_image/HeaderImage";
import { ComponentEnum } from "../../../../helpers/GlobalEnum";

export const SearchUserForRenegociation = () => {

    const navigate = useNavigate();

    const handleSearchSuccess = (userData) => {
        const { cub_id: cubId } = userData;
        navigate(`/admin/renegociation/${cubId}`)
    }

    return (
        <div className="page-wrapper">
            <HeaderImage
                imageHeader={imgDCSIPeople}
                titleHeader={`Bienvenido al Banco de Proveedores`}
                bannerIcon={imgAdd}
                backgroundIconColor={"#2148C0"}
                bannerInformation={"RENEGOCIACIÓN."}
                backgroundInformationColor={"#F66D1F"}
            />

            <section className="surface-card">
                <header className="surface-card__header">
                    <h2 className="surface-card__title">Consulta de beneficiarios</h2>
                    <span className="text-soft">Ingresa el documento para iniciar</span>
                </header>

                <div className="surface-card__body">
                    <SearchUserForm component={ComponentEnum.RENEGOTIATION} onSearchSuccess={handleSearchSuccess} />
                </div>
            </section>
        </div>
    );
}
