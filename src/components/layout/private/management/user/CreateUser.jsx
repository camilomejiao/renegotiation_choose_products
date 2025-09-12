
//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";


export const CreateUser = () => {

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={"¡Registra tus usuarios!"}
                    bannerIcon={''}
                    backgroundIconColor={''}
                    bannerInformation={''}
                    backgroundInformationColor={''}
                />

            </div>

        </>
    )
}