import React, { useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import imageLogin from '../../../../../assets/image/login/principal-image.png';
import imageLoginForm from '../../../../../assets/image/login/login-image-1.png';
import userInput from '../../../../../assets/image/login/user.png';
import lockInput from '../../../../../assets/image/login/lock.png';

import useAuth from "../../../../../hooks/useAuth";
import { authService } from "../../../../../helpers/services/Auth";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Header } from "../../../shared/header/Header";

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

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = async (values, { resetForm }) => {
        const informationToSend = {
            'mail' : values.valueOf().email,
            'pass': values.valueOf().password
        }

        // Lógica para manejar el login
        const respServicesLogin = await authService.login(informationToSend).then((data) => {
            return data;
        });

        if(!respServicesLogin.access && !respServicesLogin.refresh) {
            AlertComponent.error('Oops...', respServicesLogin.error);
        } else {
            AlertComponent.success('Bien hecho!', respServicesLogin.message);
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
            <div className="auth-page">
                <div className="auth-page__grid">
                    <div className="auth-page__card gov-form">
                        <div className="auth-page__headline">
                            <img src={imageLoginForm} alt="Portal proveedores" />
                            <h2 className="page-header__title">Bienvenido</h2>
                            <p className="text-muted">Ingrese sus credenciales para acceder</p>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <form onSubmit={handleSubmit} noValidate className="auth-form">
                                    <div className="auth-field">
                                        <label htmlFor="email" className="gov-label">Email</label>
                                        <div className="auth-field__control">
                                            <img src={userInput} alt="" className="auth-field__icon" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                placeholder="Ingrese su email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!errors.email && touched.email}
                                                aria-describedby="email-error"
                                                className={`gov-input auth-field__input ${errors.email && touched.email ? "is-invalid" : ""}`}
                                            />
                                        </div>
                                        {errors.email && touched.email && (
                                            <span id="email-error" className="auth-field__error">{errors.email}</span>
                                        )}
                                    </div>

                                    <div className="auth-field">
                                        <label htmlFor="password" className="gov-label">Contraseña</label>
                                        <div className="auth-field__control">
                                            <img src={lockInput} alt="" className="auth-field__icon" />
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Ingrese su contraseña"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!errors.password && touched.password}
                                                aria-describedby="password-error"
                                                className={`gov-input auth-field__input auth-field__input--toggle ${errors.password && touched.password ? "is-invalid" : ""}`}
                                            />
                                            <span
                                                onClick={togglePasswordVisibility}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        togglePasswordVisibility();
                                                    }
                                                }}
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                className="auth-field__toggle"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                        </div>
                                        {errors.password && touched.password && (
                                            <span id="password-error" className="auth-field__error">{errors.password}</span>
                                        )}
                                    </div>

                                    <button type="submit" className="btn btn-primary auth-submit">
                                        Iniciar Sesión
                                    </button>

                                    {/* Funcionalidad de recuperación no habilitada */}
                                </form>
                            )}
                        </Formik>
                    </div>

                    <div className="auth-page__illustration">
                        <img src={imageLogin} alt="Ilustración ingreso" />
                    </div>
                </div>
            </div>
        </>
    );
};

