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

  it("maps generic productive projects to the agricultural productive-project template", () => {
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
        causal: GRADUATION_CAUSE.PRODUCTIVE_PROJECTS,
        plan: "Plan A",
        linea: "Linea B",
        condicionante_ambiental: "No aplica",
        tiene_m2: "SI",
      },
      beneficiaryMovements: {
        estado_cuenta: [],
      },
      graduationCause: GRADUATION_CAUSE.PRODUCTIVE_PROJECTS,
    });

    expect(viewModel.sectionOne.heading).toBe(
      GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS
    );
    expect(viewModel.sectionOne.rows).toEqual(
      expect.arrayContaining([
        { label: "Plan de inversion", value: "Plan A" },
        { label: "Linea productiva", value: "Linea B" },
        { label: "Condicionante ambiental", value: "No aplica" },
      ])
    );
  });
});
