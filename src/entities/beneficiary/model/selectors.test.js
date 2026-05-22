import { GRADUATION_CAUSE } from "./constants";
import { getGraduationCause } from "./selectors";

describe("getGraduationCause", () => {
  it("returns the canonical enum value for known graduation causes", () => {
    expect(getGraduationCause("Atención Diferencial")).toBe(
      GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION
    );
    expect(
      getGraduationCause("proyectos productivos no agropecuarios")
    ).toBe(GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS);
    expect(
      getGraduationCause("  Proyectos Productivos Agropecuarios  ")
    ).toBe(GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS);
    expect(getGraduationCause("Pago de obligaciones financieras")).toBe(
      GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT
    );
  });

  it("returns the fallback when the service sends an unsupported value", () => {
    expect(getGraduationCause("")).toBe("");
    expect(getGraduationCause("causal desconocida", "---")).toBe("---");
  });
});
