import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

//Img
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";

//Component
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { HeaderImage } from "../../shared/header_image/HeaderImage";

//Enums
import { ComponentEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

export const SearchUser = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    //
    const handleSearchSuccess = (userData) => {
        const { id } = userData;

        userAuth.rol_id === RolesEnum.SUPPLIER
            ? navigate(`/admin/create-order/${id}`)
            : navigate(`/admin/reports/${id}`);
    };

    useEffect(() => {}, []);

    return (
        <div className="page-wrapper">
            <HeaderImage
                imageHeader={imgDCSIPeople}
                titleHeader={`Bienvenido al Banco de Proveedores DSCI`}
                bannerIcon={imgAdd}
                backgroundIconColor={"#2148C0"}
                bannerInformation={`Da el siguiente paso en tus ventas ahora.`}
                backgroundInformationColor={"#F66D1F"}
            />

            <section className="surface-card">
                <header className="surface-card__header">
                    <h2 className="surface-card__title">Consulta de beneficiarios</h2>
                    <span className="text-soft">Ingresa el documento para iniciar</span>
                </header>

                <div className="surface-card__body">
                    <SearchUserForm component={ComponentEnum.USER} onSearchSuccess={handleSearchSuccess} />
                </div>
            </section>
        </div>
    );
}
