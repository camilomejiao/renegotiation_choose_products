import { Container, Button } from "react-bootstrap";
import image from "../../../assets/image/404/404.png";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
    return (
        <div className="content">
            <Container className="page-not-found text-center">
                <div>
                    <img src={image} alt="Not Found" />
                </div>

                <Link to="/admin">
                    <Button variant="primary" className="mt-3">Back</Button>
                </Link>
            </Container>
        </div>
    );
}
