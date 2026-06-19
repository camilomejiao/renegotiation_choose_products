import {
  buildSectionThreeBalanceRows,
  buildSectionThreeRowsFromAccountStatement,
  resolveM2ValidationOption,
  SECTION_TWO_M2_OPTION,
} from "./documentTemplateSelectors";
import { SECTION_THREE_BALANCE_FIELDS } from "./documentTemplateConfig";

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

describe("buildSectionThreeRowsFromAccountStatement", () => {
  it("maps the account statement into the fixed pdf sections", () => {
    const rows = buildSectionThreeRowsFromAccountStatement([
      {
        component: "Asistencia Alimentaria Inmediata AAI",
        pay: "$ 100",
        payNum: 100,
        debtNum: 25,
      },
      {
        component:
          "Autosostenimiento y Seguridad Alimentaria ASA despues de renegociacion",
        pay: "$ 40",
        payNum: 40,
        debtNum: 10,
      },
      {
        component: "Proyecto Productivo Ciclo Corto PPCC despues de renegociacion",
        pay: "$ 60",
        payNum: 60,
        debtNum: 15,
      },
    ]);

    expect(rows[0]).toMatchObject({
      component: "Asistencia Alimentaria Inmediata AAI",
      totalExecuted: "$ 100",
    });
    expect(rows[4]).toMatchObject({
      operator: "No aplica",
      totalExecuted: expect.stringContaining("$"),
    });
  });
});

describe("buildSectionThreeBalanceRows", () => {
  it("derives balances from account statement when explicit fields are missing", () => {
    const rows = buildSectionThreeBalanceRows(
      {},
      SECTION_THREE_BALANCE_FIELDS,
      [
        {
          component: "Asistencia Alimentaria Inmediata AAI",
          debtNum: 2500,
        },
      ]
    );

    expect(rows[0].label).toBe("Saldo Componente AAI");
    expect(rows[0].value).toContain("2.500");
  });
});
