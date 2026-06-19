import { GRADUATION_CAUSE } from "../../../entities/beneficiary";
import { buildDocumentReportsRows, getDocumentReportsDetails } from "./selectors";

describe("beneficiary document reports selectors", () => {
  it("falls back to the mock graduation cause when testing is enabled and the service cause is empty", () => {
    const details = getDocumentReportsDetails({
      cub: "123",
      estado_titular: "Atención Finalizada",
      descripcion: "",
      causal: "",
    });

    expect(details.causal).toBe(GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION);
  });

  it("builds rows with the normalized graduation cause", () => {
    const [row] = buildDocumentReportsRows({
      cub: "123",
      estado_titular: "Atención Finalizada",
      descripcion: "",
      causal: "",
    });

    expect(row.graduationCause).toBe(GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION);
    expect(row.isDocumentEnabled).toBe(true);
  });
});
