import { AppSelect } from "../../../shared/ui/select";
import {
  AutoAssignPill,
  FieldName,
  FieldResponsable,
  FieldRow,
  FieldTable,
  FieldTableHead,
  PanelNote,
  PendingInput,
  ReadonlyBox,
  Required,
  TextArea,
  TextInput,
} from "./IndeterminateProductFields.styles";

const PENDING_LABEL = "Pendiente de Sub. Operativa";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

// Campos que completará Sub. Operativa tras la revisión (solo lectura aquí).
const PENDING_FIELDS = [
  "Precio mínimo",
  "Precio máximo",
  "Valor unitario venta nuevo",
  "Valor catálogo nuevo",
];

export const IndeterminateProductFields = ({
  row,
  form,
  onFieldChange,
  unitOptions,
  unitsLoading,
}) => (
  <>
    <PanelNote>
      Gestión individual por producto / proveedor / jornada. Implementación diligencia
      únicamente los datos base. Los valores de mercado permanecen pendientes hasta la
      revisión de Sub. Operativa.
    </PanelNote>

    <FieldTable>
      <FieldTableHead>
        <span>Campo</span>
        <span>Información del nuevo producto</span>
        <span>Responsable</span>
      </FieldTableHead>

      <FieldRow>
        <FieldName>ID Producto</FieldName>
        <div>
          <AutoAssignPill>Se asignará automáticamente después de la creación</AutoAssignPill>
        </div>
        <FieldResponsable>Sistema</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>
          Nombre producto <Required>*</Required>
        </FieldName>
        <TextInput
          value={form.productName}
          placeholder="Nombre del producto nuevo"
          maxLength={200}
          onChange={(e) => onFieldChange("productName", e.target.value)}
        />
        <FieldResponsable>Implementación</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>
          Especificación técnica <Required>*</Required>
        </FieldName>
        <TextArea
          value={form.technicalSpec}
          placeholder="Descripción / especificación técnica del producto."
          rows={3}
          maxLength={500}
          showCount
          onChange={(e) => onFieldChange("technicalSpec", e.target.value)}
        />
        <FieldResponsable>Implementación</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>
          Unidad <Required>*</Required>
        </FieldName>
        <AppSelect
          value={form.unit}
          options={unitOptions}
          isLoading={unitsLoading}
          placeholder="Selecciona una unidad"
          onChange={(option) => onFieldChange("unit", option)}
        />
        <FieldResponsable>Implementación</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>
          Marca <Required>*</Required>
        </FieldName>
        <TextInput
          value={form.brand}
          placeholder="Marca comercial"
          maxLength={120}
          onChange={(e) => onFieldChange("brand", e.target.value)}
        />
        <FieldResponsable>Implementación</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>Valor unitario venta</FieldName>
        <ReadonlyBox>{formatCurrency(row.saleUnitValue)}</ReadonlyBox>
        <FieldResponsable>Dato del producto alertado</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>Valor catálogo</FieldName>
        <ReadonlyBox>{formatCurrency(row.fairCatalogValue)}</ReadonlyBox>
        <FieldResponsable>Dato del catálogo de jornada</FieldResponsable>
      </FieldRow>

      <FieldRow>
        <FieldName>Valor catálogo feria proveedor</FieldName>
        <ReadonlyBox>{formatCurrency(row.fairCatalogValue)}</ReadonlyBox>
        <FieldResponsable>Dato del producto alertado</FieldResponsable>
      </FieldRow>

      {PENDING_FIELDS.map((label) => (
        <FieldRow key={label}>
          <FieldName>{label}</FieldName>
          <PendingInput disabled placeholder={PENDING_LABEL} />
          <FieldResponsable>Sub. Operativa</FieldResponsable>
        </FieldRow>
      ))}
    </FieldTable>
  </>
);