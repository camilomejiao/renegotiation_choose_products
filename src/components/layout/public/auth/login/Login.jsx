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
        console.log("🔍 Intentando login con:", values);
        const payload = { mail: values.email, pass: values.password };
        console.log("📤 Payload enviado:", payload);

        try {
            const response = await authService.login(payload);
            console.log("📥 Respuesta recibida:", response);

            if (!response.access && !response.refresh) {
                AlertComponent.error("Oops...", response.error);
            } else {
                AlertComponent.success("Bien hecho!", response.message);
                setAuth(response);
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            console.error("❌ Error en login:", error);
            AlertComponent.error("Error", "Error de conexión con el servidor");
        }

        resetForm();
    };

    return (
        <>
            <Header />
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f1f5f9',
                paddingTop: '80px'
            }}>
                <div style={{ width: '100%', maxWidth: '1000px', padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '100%', maxWidth: '800px' }}>
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                border: 'none',
                                overflow: 'hidden',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                minHeight: '600px'
                            }}>
                                <div style={{ padding: '48px' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                        <img src={imageLoginForm} alt="Portal proveedores" style={{ width: '80px', marginBottom: '16px' }} />
                                        <h2 style={{ fontWeight: 'bold', color: '#1e3a8a', marginBottom: '8px', fontSize: '28px' }}>Bienvenido</h2>
                                        <p style={{ color: '#64748b', fontSize: '14px' }}>Ingrese sus credenciales para acceder</p>
                                    </div>

                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={loginSchema}
                                        onSubmit={handleLogin}
                                    >
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                                <div>
                                                    <label htmlFor="email" style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Email</label>
                                                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                                        <img src={userInput} alt="" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', zIndex: 2 }} />
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
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px 16px 12px 40px',
                                                                border: `2px solid ${errors.email && touched.email ? '#ef4444' : '#e2e8f0'}`,
                                                                borderRadius: '8px',
                                                                fontSize: '14px',
                                                                transition: 'all 0.2s ease',
                                                                backgroundColor: 'white',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => {
                                                                if (!errors.email) {
                                                                    e.target.style.borderColor = '#1e3a8a';
                                                                    e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                handleBlur(e);
                                                                if (!errors.email) {
                                                                    e.target.style.borderColor = '#e2e8f0';
                                                                    e.target.style.boxShadow = 'none';
                                                                }
                                                            }}
                                                        />
                                                        {errors.email && touched.email && (
                                                            <span id="email-error" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label htmlFor="password" style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '8px', fontSize: '14px' }}>Contraseña</label>
                                                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                                        <img src={lockInput} alt="" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', zIndex: 2 }} />
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
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px 40px 12px 40px',
                                                                border: `2px solid ${errors.password && touched.password ? '#ef4444' : '#e2e8f0'}`,
                                                                borderRadius: '8px',
                                                                fontSize: '14px',
                                                                transition: 'all 0.2s ease',
                                                                backgroundColor: 'white',
                                                                outline: 'none'
                                                            }}
                                                            onFocus={(e) => {
                                                                if (!errors.password) {
                                                                    e.target.style.borderColor = '#1e3a8a';
                                                                    e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                handleBlur(e);
                                                                if (!errors.password) {
                                                                    e.target.style.borderColor = '#e2e8f0';
                                                                    e.target.style.boxShadow = 'none';
                                                                }
                                                            }}
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
                                                            style={{
                                                                position: 'absolute',
                                                                right: '12px',
                                                                top: '50%',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                                color: '#64748b',
                                                                zIndex: 2,
                                                                padding: '4px',
                                                                borderRadius: '4px',
                                                                transition: 'color 0.2s ease'
                                                            }}
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </span>
                                                        {errors.password && touched.password && (
                                                            <span id="password-error" style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button 
                                                    type="submit" 
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 24px',
                                                        borderRadius: '8px',
                                                        fontWeight: 500,
                                                        fontSize: '14px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                                                        color: 'white',
                                                        textAlign: 'center',
                                                        textDecoration: 'none',
                                                        display: 'inline-block'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.background = 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)';
                                                        e.target.style.transform = 'translateY(-1px)';
                                                        e.target.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    Iniciar Sesión
                                                </button>

                                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                                    <a 
                                                        href="/forgot-password" 
                                                        style={{
                                                            color: '#64748b',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                            transition: 'color 0.2s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.color = '#1e3a8a';
                                                            e.target.style.textDecoration = 'underline';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.color = '#64748b';
                                                            e.target.style.textDecoration = 'none';
                                                        }}
                                                    >
                                                        ¿Olvidó su contraseña?
                                                    </a>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                                
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img 
                                        src={imageLogin} 
                                        alt="Ilustración ingreso" 
                                        style={{
                                            width: '95%',
                                            height: '95%',
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
