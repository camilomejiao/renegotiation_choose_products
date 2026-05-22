import {
  resolveM2ValidationOption,
  SECTION_TWO_M2_OPTION,
} from "./documentTemplateSelectors";

describe("resolveM2ValidationOption", () => {
  it("marks yes when the service sends SI", () => {
    expect(resolveM2ValidationOption("SI")).toBe(SECTION_TWO_M2_OPTION.YES);
    expect(resolveM2ValidationOption("Sí")).toBe(SECTION_TWO_M2_OPTION.YES);
  });

  it("marks no when the service sends NO", () => {
    expect(resolveM2ValidationOption("NO")).toBe(SECTION_TWO_M2_OPTION.NO);
  });

  it("marks no aplica when the service does not send a value", () => {
    expect(resolveM2ValidationOption("")).toBe(
      SECTION_TWO_M2_OPTION.NOT_APPLICABLE
    );
    expect(resolveM2ValidationOption(null)).toBe(
      SECTION_TWO_M2_OPTION.NOT_APPLICABLE
    );
  });
});
