// Encabezado de columna multilínea centrado (uso común en SmartTable).
export const wrapTitle = (...lines) => (
  <span
    style={{
      display: "inline-block",
      width: "100%",
      whiteSpace: "normal",
      lineHeight: 1.15,
      textAlign: "center",
    }}
  >
    {lines.map((line, i) => (
      <span key={i} style={{ display: "block" }}>
        {line}
      </span>
    ))}
  </span>
);