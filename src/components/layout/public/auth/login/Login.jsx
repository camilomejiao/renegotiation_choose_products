import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Swal from "sweetalert2";
import imageLogin from '../../../../../assets/image/login/principal-image.png';
import imageLoginForm from '../../../../../assets/image/login/login-image-1.png';
import userInput from '../../../../../assets/image/login/user.png';
import lockInput from '../../../../../assets/image/login/lock.png';
import { Formik } from 'formik';
import * as yup from 'yup';

//css
import './Login.css';

//
import { Header } from "../../../shared/header/Header";
import useAuth from "../../../../../hooks/useAuth";

//Services
import {authService} from "../../../../../helpers/services/Auth";

const initialValues = {
    email: "",
    password: "",
};

const loginSchema = yup.object().shape({
    email: yup.string().required("Email es requerido"),
    password: yup.string().required("Contraseña es requerida"),
});

export const Login = () => {

    const {setAuth} = useAuth();
    const handleLogin = async (values, { resetForm }) => {
        const informationToSend = {
            'mail' : values.valueOf().email,
            'pass': values.valueOf().password
        }

        // Lógica para manejar el login
        const respServicesLogin = await authService.login(informationToSend).then((data) => {
            return data;
        });

        //console.log(respServicesLogin);
        if(!respServicesLogin.access && !respServicesLogin.refresh) {
            Swal.fire({title: 'Oops...', html: respServicesLogin.message, icon: 'error', width: 300, heightAuto: true});
        } else {
            Swal.fire({title: 'Bien hecho!', html: respServicesLogin.message, icon: 'success', width: 300, heightAuto: true});
            setAuth(respServicesLogin);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

        // Reiniciar el formulario después del envío
        resetForm();
    };

    return (
        <>
            <Header />
            <Container fluid className="login-container d-flex justify-content-center align-items-center">
                <Row className="login-row">
                    <Col md={6} className="login-form-container d-flex flex-column justify-content-center align-items-center">
                        <div className="">
                            <div className="text-center mb-4">
                                <img src={imageLoginForm} alt="login icon" className="w-25" />
                            </div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={loginSchema}
                                onSubmit={handleLogin}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="email" className="mb-3">
                                            <div className="input-icon-wrapper">
                                                <img src={userInput} alt="icono usuario" className="input-icon-img" />
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="EMAIL"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.email && touched.email}
                                                />
                                            </div>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="password" className="mb-3">
                                            <div className="input-icon-wrapper">
                                                <img src={lockInput} alt="icono candado" className="input-icon-img" />
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="CONTRASEÑA"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    isInvalid={!!errors.password && touched.password}
                                                />
                                            </div>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button type="submit" className="login-button w-100 mb-3">
                                            LOGIN
                                        </Button>
                                        <div className="d-flex justify-content-end">
                                            <a href="/forgot-password" className="forgot-password-link">
                                                ¿Olvidó su contraseña?
                                            </a>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </Col>
                    <Col md={6} className="login-image-container d-none d-md-block">
                        <img src={imageLogin} alt="Imagen Login" className="login-image" />
                    </Col>
                </Row>
            </Container>
        </>
    );
};
