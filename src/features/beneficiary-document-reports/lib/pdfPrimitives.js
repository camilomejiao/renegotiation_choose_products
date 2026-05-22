const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_HEIGHT = 792;

export const PDF_PAGE = {
  width: PDF_PAGE_WIDTH,
  height: PDF_PAGE_HEIGHT,
};

export const PDF_COLORS = {
  background: [0.12, 0.12, 0.12],
  white: [1, 1, 1],
  muted: [0.76, 0.78, 0.82],
};

export const sanitizePdfText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/[\\()]/g, "\\$&");

export const getOptionalPdfText = (value) =>
  sanitizePdfText(String(value ?? "").trim());

export const estimateTextWidth = (text, fontSize) =>
  sanitizePdfText(text).length * fontSize * 0.52;

export const wrapPdfText = (text, maxChars) => {
  const content = getOptionalPdfText(text);

  if (!content) {
    return [""];
  }

  const words = content.split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxChars) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const wrapPdfTextToWidth = (text, maxWidth, fontSize = 12) => {
  const content = getOptionalPdfText(text);

  if (!content) {
    return [""];
  }

  const words = content.split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (estimateTextWidth(nextLine, fontSize) <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const drawPdfText = ({
  text,
  x,
  y,
  font = "F1",
  fontSize = 12,
  color = PDF_COLORS.white,
  align = "left",
}) => {
  const safeText = sanitizePdfText(text);
  const resolvedX =
    align === "center" ? x - estimateTextWidth(safeText, fontSize) / 2 : x;

  return `BT /${font} ${fontSize} Tf ${color.join(" ")} rg 1 0 0 1 ${resolvedX.toFixed(
    2
  )} ${y.toFixed(2)} Tm (${safeText}) Tj ET`;
};

export const drawPdfLine = ({
  x1,
  y1,
  x2,
  y2,
  color = PDF_COLORS.white,
  width = 1,
}) =>
  `q ${color.join(" ")} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(
    2
  )} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S Q`;

export const drawPdfFilledRect = ({ x, y, width, height, color }) =>
  `q ${color.join(" ")} rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(
    2
  )} ${height.toFixed(2)} re f Q`;

export const createPdfBlobFromOperations = (operations) =>
  createPdfBlobFromPages([operations]);

export const createPdfBlobFromPages = (pages = []) => {
  const resolvedPages = pages.length > 0 ? pages : [[]];
  const contentStreams = resolvedPages.map((operations) =>
    Array.isArray(operations) ? operations.join("\n") : String(operations || "")
  );
  const pageRefs = contentStreams.map((_, index) => 3 + index * 2);
  const contentRefs = contentStreams.map((_, index) => pageRefs[index] + 1);
  const firstFontRef = contentRefs[contentRefs.length - 1] + 1;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
    `2 0 obj\n<< /Type /Pages /Kids [${pageRefs
      .map((pageRef) => `${pageRef} 0 R`)
      .join(" ")}] /Count ${pageRefs.length} >>\nendobj`,
  ];

  contentStreams.forEach((contentStream, index) => {
    objects.push(
      `${pageRefs[index]} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] /Resources << /Font << /F1 ${firstFontRef} 0 R /F2 ${
        firstFontRef + 1
      } 0 R /F3 ${firstFontRef + 2} 0 R >> >> /Contents ${
        contentRefs[index]
      } 0 R >>\nendobj`
    );
    objects.push(
      `${contentRefs[index]} 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj`
    );
  });

  objects.push(
    `${firstFontRef} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`
  );
  objects.push(
    `${firstFontRef + 1} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`
  );
  objects.push(
    `${firstFontRef + 2} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>\nendobj`
  );

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};
