import { parseProductUploadClipboard } from "./parseProductUploadClipboard";
import * as XLSX from "xlsx";

describe("parseProductUploadClipboard", () => {
  it("parses the shared provider upload template into 16 products", () => {
    const workbook = XLSX.readFile("docs/SubidaProductosProvedores 2.xlsx");
    const worksheet = workbook.Sheets.Productos;
    const clipboardText = XLSX.utils
      .sheet_to_json(worksheet, { header: 1, raw: false, defval: "" })
      .map((row) => row.join("\t"))
      .join("\r\n");

    const { rows, hasValidSeparator } = parseProductUploadClipboard({
      clipboardText,
      categoryOptions: [
        { id: 1, nombre: "AGROPECUARIO - SEMOVIVIENTES" },
        { id: 2, nombre: "AGROPECUARIO - MAQUINARIA Y EQUIPOS" },
      ],
      unitOptions: [
        { id: 1, nombre: "Unidad" },
        { id: 2, nombre: "CAJA" },
      ],
    });

    expect(hasValidSeparator).toBe(true);
    expect(rows).toHaveLength(16);
    expect(rows[1]).toMatchObject({
      id: "2",
      name: "Producto prueba 2\nHola Camilo",
      unit: 2,
      price_min: 100000,
      price_max: 150000,
    });
  });

  it("keeps multiline text inside the same row when the clipboard comes from Excel", () => {
    const { rows, hasValidSeparator } = parseProductUploadClipboard({
      clipboardText:
        "ID\tCategoría\tNombre\tUnidad\tPrecio Min\tPrecio Max\r\n" +
        "1\tCategoria Uno\tNombre con\nsalto\tUnidad Uno\t100\t200",
      categoryOptions: [{ id: 10, nombre: "Categoria Uno" }],
      unitOptions: [{ id: 20, nombre: "Unidad Uno" }],
    });

    expect(hasValidSeparator).toBe(true);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id: "1",
      category: 10,
      unit: 20,
      name: "Nombre con\nsalto",
      price_min: 100,
      price_max: 200,
    });
  });

  it("removes special characters from category, name and unit on paste", () => {
    const { rows } = parseProductUploadClipboard({
      clipboardText: '2\t"Cat-egoría #1"\t"Nom@bre ++ 123"\t"Uni*dad %"\t10\t20',
      categoryOptions: [{ id: 1, nombre: "Categoria 1" }],
      unitOptions: [{ id: 2, nombre: "Unidad" }],
    });

    expect(rows[0]).toMatchObject({
      category: 1,
      unit: 2,
      name: "Nombre 123",
      categoryLabel: "Categoria 1",
      unitLabel: "Unidad",
    });
  });
});
