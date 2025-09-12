
//Components
import {HeaderImage} from "../../../shared/header_image/HeaderImage";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";


export const CreateSuppliers = () => {

    return(
        <>

            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={"¡Registra tus proveedores!"}
                    bannerIcon={''}
                    backgroundIconColor={''}
                    bannerInformation={''}
                    backgroundInformationColor={''}
                />

            </div>
        </>
    )
}