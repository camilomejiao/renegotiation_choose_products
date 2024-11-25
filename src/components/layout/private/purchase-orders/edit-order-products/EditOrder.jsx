import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

//Components
import { HeaderImage} from "../../../shared/header-image/HeaderImage";
import { UserInformation } from "../../user-information/UserInformation";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
import imgAdd from "../../../../../assets/image/addProducts/imgAdd.png";

//Services
import { userService } from "../../../../../helpers/services/UserServices";

//Enum
import {StatusEnum} from "../../../../../helpers/GlobalEnum";


export const EditOrder = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [saldoRestante, setSaldoRestante] = useState(0);

    //Obtener la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);

            if(status === StatusEnum.OK) {
                setUserData(data);
                setSaldoRestante(data.monto_proveedores);
            }
        } catch (error) {
            console.log(error, 'Error buscando productos:');
        }
    }

    useEffect(() => {
        if (params?.cub_id && params?.order_id) {
            getUserInformation(params.cub_id);
        } else {
            console.error("Faltan parámetros en la URL");
            navigate('/error-page');
        }
    },[]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Empieza a editar tus productos!'}
                    bannerIcon={imgAdd}
                    bannerInformation={'Todo está listo para que completes tu pedido de forma rápida y sencilla.'}
                />

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

            </div>

        </>
    )
}