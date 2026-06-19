import { GRADUATION_CAUSE } from "./constants";
import {
  canGenerateDocumentFromGraduationCause,
  getGraduationCause,
} from "./selectors";

describe("getGraduationCause", () => {
  it("returns the canonical enum value for known graduation causes", () => {
    expect(getGraduationCause("Atención Diferencial")).toBe(
      GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION
    );
    expect(getGraduationCause("renegociacion no agro")).toBe(
      GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS
    );
    expect(getGraduationCause("  renegociacion agro  ")).toBe(
      GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS
    );
    expect(getGraduationCause("abono bac")).toBe(
      GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT
    );
  });

  it("returns the fallback when the service sends an unsupported value", () => {
    expect(getGraduationCause("")).toBe("");
    expect(getGraduationCause("causal desconocida", "---")).toBe("---");
  });

  it("enables closure documents for the supported graduation causes", () => {
    expect(
      canGenerateDocumentFromGraduationCause(
        GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION
      )
    ).toBe(true);
    expect(
      canGenerateDocumentFromGraduationCause(
        GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT
      )
    ).toBe(true);
    expect(
      canGenerateDocumentFromGraduationCause(
        GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS
      )
    ).toBe(true);
    expect(
      canGenerateDocumentFromGraduationCause(
        GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS
      )
    ).toBe(true);
  });
});
