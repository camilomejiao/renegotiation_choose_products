import Swal from "sweetalert2";

class AlertComponent {
    static success(title, message, options = {}) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "success",
            width: 300,
            heightAuto: true,
            ...options,
        });
    }

    static error(title, message, options = {}) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
            ...options,
        });
    }

    static Error(title, html, options = {}) {
        return Swal.fire({
            title: title,
            html: html,
            icon: "error",
            width: 360,
            heightAuto: true,
            ...options,
        });
    }

    static info(title, message, options = {}) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "info",
            width: 300,
            heightAuto: true,
            ...options,
        });
    }

    static warning(title, message, options = {}) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            width: 300,
            heightAuto: true,
            ...options,
        });
    }
}

export default AlertComponent;
