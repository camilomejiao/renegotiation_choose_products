import { GRADUATION_CAUSE } from "../../../entities/beneficiary";
import { buildClosureDocumentLines } from "./buildClosureDocumentLines";

describe("buildClosureDocumentLines", () => {
  it("builds section 1 for attention differential with mapped beneficiary data", () => {
    const lines = buildClosureDocumentLines({
      beneficiaryDetails: {
        cub: "12345",
        nombre_completo: "Maria Perez",
        identificacion: "100200300",
        nombre_completo_beneficiario: "Juan Perez",
        identificacion_beneficiario: "400500600",
        departamento: "Caqueta",
        municipio: "Florencia",
        vereda: "La Esperanza",
        causal: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
      },
      row: {
        graduationCause: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
      },
    });

    expect(lines).toContain("ATENCION DIFERENCIAL");
    expect(lines).toContain("CUB: 12345");
    expect(lines).toContain("Nombre del Titular: Maria Perez");
    expect(lines).toContain("Cedula del titular: 100200300");
    expect(lines).toContain("Nombre del beneficiario: Juan Perez");
    expect(lines).toContain("Cedula del beneficiario: 400500600");
    expect(lines).toContain("Departamento: Caqueta");
    expect(lines).toContain("Municipio: Florencia");
    expect(lines).toContain("Vereda: La Esperanza");
    expect(lines).toContain("Tipo de atencion: Atención Diferencial");
    expect(lines).toContain("JUSTIFICACION");
  });

  it("keeps optional fields empty without breaking the document", () => {
    const lines = buildClosureDocumentLines({
      beneficiaryDetails: {
        cub: "999",
        causal: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
      },
      row: {
        graduationCause: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
      },
    });

    expect(lines).toContain("CUB: 999");
    expect(lines).toContain("Nombre del Titular:");
    expect(lines).toContain("Cedula del titular:");
    expect(lines).toContain("Tipo de atencion: Atención Diferencial");
  });

  it("returns a fallback document for causals not implemented yet", () => {
    const lines = buildClosureDocumentLines({
      beneficiaryDetails: {
        cub: "123",
      },
      row: {
        holderStatus: "Atencion Finalizada",
        graduationCause: GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
      },
    });

    expect(lines).toContain("Documento de cierre PNIS");
    expect(lines).toContain("La plantilla PDF para esta causal aun no ha sido implementada.");
  });
});
