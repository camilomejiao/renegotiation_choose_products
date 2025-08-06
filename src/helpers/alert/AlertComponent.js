import Swal from "sweetalert2";

class AlertComponent {
    static success(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: "success",
            width: 300,
            heightAuto: true,
        });
    }

    static error(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
        });
    }

    static info(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: "info",
            width: 300,
            heightAuto: true,
        });
    }

    static warning(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: "warning",
            width: 300,
            heightAuto: true,
        });
    }
}

export default AlertComponent;
