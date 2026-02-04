import image from "../../../assets/image/404/404.png";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
    return (
        <div className="page-standalone">
            <div className="page-standalone__content">
                <img src={image} alt="Not Found" />
                <Link to="/admin" className="btn btn-primary">Back</Link>
            </div>
        </div>
    );
}
