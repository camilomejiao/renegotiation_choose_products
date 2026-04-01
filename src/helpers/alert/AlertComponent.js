import Swal from "sweetalert2";

class AlertComponent {
    static success(title, message) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "success",
            width: 300,
            heightAuto: true,
        });
    }

    static error(title, message) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
        });
    }

    static Error(title, html) {
        return Swal.fire({
            title: title,
            html: html,
            icon: "error",
            width: 360,
            heightAuto: true,
        });
    }

    static info(title, message) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "info",
            width: 300,
            heightAuto: true,
        });
    }

    static warning(title, message) {
        return Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            width: 300,
            heightAuto: true,
        });
    }
}

export default AlertComponent;
