import { GRADUATION_CAUSE } from "../../../entities/beneficiary";
import { buildClosureDocumentPdfViewModel } from "./buildClosureDocumentPdfViewModel";

describe("buildClosureDocumentPdfViewModel", () => {
  it("builds the section data needed by the pdf renderer", () => {
    const viewModel = buildClosureDocumentPdfViewModel({
      beneficiaryDetails: {
        cub: "123",
        nombre_completo: "Maria Perez",
        identificacion: "100",
        nombre_completo_beneficiario: "Juan Perez",
        identificacion_beneficiario: "200",
        departamento: "Meta",
        municipio: "Granada",
        vereda: "Centro",
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
      graduationCause: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
    });

    expect(viewModel.sectionOne.rows).toEqual(
      expect.arrayContaining([{ label: "CUB", value: "123" }])
    );
    expect(viewModel.sectionTwo.selectedOption).toBe("yes");
    expect(viewModel.sectionThree.rows).toHaveLength(6);
    expect(viewModel.sectionFour.subtitle).toBeDefined();
    expect(viewModel.sectionFive.rows).toHaveLength(9);
  });
});
