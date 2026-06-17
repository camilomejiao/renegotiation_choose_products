import { GRADUATION_CAUSE } from "../../../entities/beneficiary";
import {
  createClosureDocumentPdfBlob,
  getSectionOneTableRows,
} from "./createClosureDocumentPdfBlob";

describe("getSectionOneTableRows", () => {
  const beneficiaryDetails = {
    cub: "123",
    nombre_completo: "Maria Perez",
    identificacion: "100",
    nombre_completo_beneficiario: "Juan Perez",
    identificacion_beneficiario: "200",
    departamento: "Meta",
    municipio: "Granada",
    vereda: "Centro",
    causal: GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS,
    plan: "Plan A",
    linea: "Linea B",
    condicionante_ambiental: "No aplica",
  };

  it("adds productive project fields for non-agricultural projects", () => {
    const rows = getSectionOneTableRows(
      beneficiaryDetails,
      GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS
    );

    expect(rows).toEqual(
      expect.arrayContaining([
        { label: "Plan de inversion", value: "Plan A" },
        { label: "Linea productiva", value: "Linea B" },
        { label: "Condicionante ambiental", value: "No aplica" },
      ])
    );
  });

  it("adds productive project fields for agricultural projects", () => {
    const rows = getSectionOneTableRows(
      beneficiaryDetails,
      GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS
    );

    expect(rows).toEqual(
      expect.arrayContaining([
        { label: "Plan de inversion", value: "Plan A" },
        { label: "Linea productiva", value: "Linea B" },
        { label: "Condicionante ambiental", value: "No aplica" },
      ])
    );
  });

  it("reuses the agricultural template for generic productive projects", () => {
    const rows = getSectionOneTableRows(
      beneficiaryDetails,
      GRADUATION_CAUSE.PRODUCTIVE_PROJECTS
    );

    expect(rows).toEqual(
      expect.arrayContaining([
        { label: "Plan de inversion", value: "Plan A" },
        { label: "Linea productiva", value: "Linea B" },
        { label: "Condicionante ambiental", value: "No aplica" },
      ])
    );
  });

  it("keeps the shorter section 1 for attention differential", () => {
    const rows = getSectionOneTableRows(
      beneficiaryDetails,
      GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION
    );

    expect(rows).not.toEqual(
      expect.arrayContaining([
        { label: "Plan de inversion", value: "Plan A" },
        { label: "Linea productiva", value: "Linea B" },
        { label: "Condicionante ambiental", value: "No aplica" },
      ])
    );
  });

  it("builds a pdf blob without crashing when section 2 is included", () => {
    const blob = createClosureDocumentPdfBlob({
      beneficiaryDetails: {
        ...beneficiaryDetails,
        causal: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
        tiene_m2: "SI",
      },
      beneficiaryMovements: {
        estado_cuenta: [
          {
            component: "Asistencia Alimentaria Inmediata AAI",
            pay: "$ 100",
            payNum: 100,
            debtNum: 10,
          },
        ],
      },
      row: {
        graduationCause: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
      },
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe("application/pdf");
  });
});
