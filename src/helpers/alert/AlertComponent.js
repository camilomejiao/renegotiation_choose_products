import Swal from "sweetalert2";

class AlertComponent {
  static success(title, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: "success",
      confirmButtonText: "Aceptar",
      customClass: {
        confirmButton: "swal2-modern-confirm swal2-success",
      },
    });
  }

  static error(title, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: "error",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "swal2-modern-confirm swal2-error",
      },
    });
  }

  static info(title, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: "info",
      confirmButtonText: "Aceptar",
      customClass: {
        confirmButton: "swal2-modern-confirm swal2-info",
      },
    });
  }

  static warning(title, message) {
    Swal.fire({
      title: title,
      text: message,
      icon: "warning",
      confirmButtonText: "Entendido",
      customClass: {
        confirmButton: "swal2-modern-confirm swal2-warning",
      },
    });
  }
}

export default AlertComponent;
