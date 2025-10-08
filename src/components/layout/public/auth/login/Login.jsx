import { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import imageLogin from "../../../../../assets/image/login/principal-image.png";
import imageLoginForm from "../../../../../assets/image/login/login-image-1.png";
import userInput from "../../../../../assets/image/login/user.png";
import lockInput from "../../../../../assets/image/login/lock.png";

import useAuth from "../../../../../hooks/useAuth";
import { authService } from "../../../../../helpers/services/Auth";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Header } from "../../../shared/header/Header";

const initialValues = {
    email: "",
    password: "",
};

const loginSchema = yup.object().shape({
    email: yup.string().required("Correo electrónico requerido"),
    password: yup.string().required("Contraseña requerida"),
});

export const Login = () => {
    const { setAuth } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleLogin = async (values, { resetForm }) => {
        const payload = { mail: values.email, pass: values.password };

        const response = await authService.login(payload);

        if (!response.access && !response.refresh) {
            AlertComponent.error("Oops...", response.error);
        } else {
            AlertComponent.success("Bien hecho!", response.message);
            setAuth(response);
            setTimeout(() => window.location.reload(), 2000);
        }

        resetForm();
    };

    return (
        <>
            <Header />
            <main className="auth-page">
                <div className="auth-page__grid">
                    <section className="surface-card auth-page__card">
                        <div className="auth-page__headline">
                            <img src={imageLoginForm} alt="Portal proveedores" />
                            <div>
                                <h2 className="page-header__title">Ingreso</h2>
                                <p className="text-soft">
                                    Accede con tu correo y contraseña para continuar con la gestión de proveedores PNIS.
                                </p>
                            </div>
                        </div>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={loginSchema}
                            onSubmit={handleLogin}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <form className="form-section" onSubmit={handleSubmit} noValidate>
                                    <div>
                                        <label htmlFor="email" className="form-section__subtitle">Correo electrónico</label>
                                        <div className="input-with-icon">
                                            <img src={userInput} alt="" className="input-with-icon__icon" />
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                className="input-field input-field--accent"
                                                placeholder="correo@dominio.com"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!errors.email && touched.email}
                                                aria-describedby="email-error"
                                            />
                                            {errors.email && touched.email && (
                                                <span id="email-error" className="input-error">{errors.email}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="form-section__subtitle">Contraseña</label>
                                        <div className="input-with-icon">
                                            <img src={lockInput} alt="" className="input-with-icon__icon" />
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="input-field input-field--accent"
                                                placeholder="********"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                aria-invalid={!!errors.password && touched.password}
                                                aria-describedby="password-error"
                                            />
                                            <span
                                                className="input-with-icon__toggle"
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
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                            {errors.password && touched.password && (
                                                <span id="password-error" className="input-error">{errors.password}</span>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="button-pill button-pill--full">
                                        Iniciar sesión
                                    </button>

                                    <div className="auth-page__footer">
                                        <a href="/forgot-password" className="auth-page__link">
                                            ¿Olvidó su contraseña?
                                        </a>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </section>

                    <aside className="auth-page__illustration">
                        <img src={imageLogin} alt="Ilustración ingreso" />
                    </aside>
                </div>
            </main>
        </>
    );
};
