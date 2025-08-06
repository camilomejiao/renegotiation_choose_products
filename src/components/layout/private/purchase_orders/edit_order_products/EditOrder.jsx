import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

//Components
import { HeaderImage} from "../../../shared/header_image/HeaderImage";
import { UserInformation } from "../../../shared/user_information/UserInformation";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
import imgAdd from "../../../../../assets/image/addProducts/imgAdd.png";

//Services
import { userService } from "../../../../../helpers/services/UserServices";

//Enum
import {ResponseStatusEnum} from "../../../../../helpers/GlobalEnum";


export const EditOrder = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({});
    const [saldoRestante, setSaldoRestante] = useState(0);

    //Obtener la información del usuario
    const getUserInformation = async (cubId) => {
        try {
            const { data, status} = await userService.userInformation(cubId);

            if(status === ResponseStatusEnum.OK) {
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
                    backgroundIconColor={'#ff5722'}
                    bannerInformation={'Todo está listo para que completes tu pedido de forma rápida y sencilla.'}
                    backgroundInformationColor={'#0056b3'}
                />

                {/* Contenedor de la información del usuario */}
                <UserInformation userData={userData} />

            </div>

        </>
    )
}