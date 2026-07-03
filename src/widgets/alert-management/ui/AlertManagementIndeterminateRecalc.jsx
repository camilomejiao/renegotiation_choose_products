import AlertComponent from "../../../helpers/alert/AlertComponent";
import { StatusPill } from "../../../shared/ui/status-pill";
import { formatCopInput, parseCopInput } from "../model/alertManagementConstants";
import { useIndeterminateRecalc } from "../model/useIndeterminateRecalc";
import {
  CalcButton,
  CalcButtonRow,
  CurrencyInput,
  ObservationInput,
  ProductName,
  RecalcBanner,
  RecalcHead,
  RecalcRow,
  RecalcSection,
  RecalcTable,
  RecalcTableWrapper,
  ResultMessage,
} from "./AlertManagementIndeterminateRecalc.styles";

const PILL_TOKENS = {
  neutral: { background: "#F3F4F6", border: "#D1D5DB", color: "#374151" },
  green: { background: "#E8F8EE", border: "#B7E4C7", color: "#04995B" },
  amber: { background: "#FFF4DB", border: "#FCDDA2", color: "#B45309" },
  red: { background: "#FEE2E2", border: "#FCA5A5", color: "#991B1B" },
};

const renderResultPill = (result) => {
  const tone = result ? PILL_TOKENS[result.tone] : PILL_TOKENS.neutral;
  return (
    <StatusPill
      backgroundColor={tone.background}
      borderColor={tone.border}
      textColor={tone.color}
      minHeight="28px"
      padding="4px 12px"
      fontSize="12px"
      fontWeight={800}
      uppercase
    >
      {result ? result.label : "Pendiente"}
    </StatusPill>
  );
};

const CURRENCY_FIELDS = [
  { key: "precioMinimo", placeholder: "$ 0" },
  { key: "precioMaximo", placeholder: "$ 0" },
  { key: "valorVentaNuevo", placeholder: "$ 0" },
  { key: "valorCatalogoNuevo", placeholder: "$ 0" },
];

export const AlertManagementIndeterminateRecalc = ({ productName }) => {
  const { values, setField, observacion, setObservacion, result, canCalculate, calculate } =
    useIndeterminateRecalc();

  const handleCalculate = () => {
    if (!canCalculate) {
      AlertComponent.warning(
        "Valores incompletos",
        "Diligencie los cuatro valores de mercado (precio mínimo, precio máximo, valor unitario venta nuevo y valor catálogo nuevo) para calcular el resultado."
      );
      return;
    }
    calculate();
  };

  return (
    <RecalcSection>
      <RecalcBanner>
        Sub. Operativa completa los valores de mercado, ejecuta el recálculo y visualiza el
        resultado antes de responder sin observación o devolver a subsanación.
      </RecalcBanner>

      <RecalcTableWrapper>
        <RecalcTable>
          <RecalcHead>
            <span>Nuevo producto</span>
            <span>Precio mínimo</span>
            <span>Precio máximo</span>
            <span>Valor unitario venta nuevo</span>
            <span>Valor catálogo nuevo</span>
            <span>Observación</span>
            <span>Resultado</span>
          </RecalcHead>
          <RecalcRow>
            <ProductName>{productName || "Nuevo producto"}</ProductName>
            {CURRENCY_FIELDS.map(({ key, placeholder }) => (
              <CurrencyInput
                key={key}
                value={values[key] ?? null}
                min={0}
                controls={false}
                placeholder={placeholder}
                formatter={formatCopInput}
                parser={parseCopInput}
                onChange={(next) => setField(key, next)}
              />
            ))}
            <ObservationInput
              value={observacion}
              placeholder="Observación del recálculo"
              maxLength={300}
              onChange={(e) => setObservacion(e.target.value)}
            />
            {renderResultPill(result)}
          </RecalcRow>
        </RecalcTable>
      </RecalcTableWrapper>

      <CalcButtonRow>
        <CalcButton onClick={handleCalculate}>Calcular resultado</CalcButton>
      </CalcButtonRow>

      {result ? <ResultMessage $tone={result.tone}>{result.message}</ResultMessage> : null}
    </RecalcSection>
  );
};