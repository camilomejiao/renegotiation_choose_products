export const getOrderRequestPreviewTimestamp = () => {
  const now = new Date();
  const date = now.toLocaleDateString("sv-SE");
  const time = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${date} ${time}`;
};
