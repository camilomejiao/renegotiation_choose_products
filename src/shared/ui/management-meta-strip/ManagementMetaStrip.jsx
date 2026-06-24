import {
  MetaLabel,
  MetaStatusPill,
  MetaStripItem,
  MetaStripRoot,
  MetaTypeBadge,
  MetaValue,
} from "./ManagementMetaStrip.styles";

/**
 * Barra horizontal de metadatos reutilizable para todas las vistas de tipo de gestión.
 *
 * Cada item del array puede tener:
 *   label    {string}  — etiqueta superior
 *   value    {string}  — valor a mostrar
 *   variant  {'default' | 'type' | 'status'}  — presentación visual del valor
 *   statusColor {'default' | 'success' | 'warning' | 'error'}  — color para variant='status'
 */
export const ManagementMetaStrip = ({ items = [] }) => (
  <MetaStripRoot>
    {items.map((item, idx) => (
      <MetaStripItem key={idx}>
        <MetaLabel>{item.label}</MetaLabel>
        {item.variant === "type" ? (
          <MetaTypeBadge>{item.value || "—"}</MetaTypeBadge>
        ) : item.variant === "status" ? (
          <MetaStatusPill $color={item.statusColor || "default"}>
            {item.value || "—"}
          </MetaStatusPill>
        ) : (
          <MetaValue>{item.value || "—"}</MetaValue>
        )}
      </MetaStripItem>
    ))}
  </MetaStripRoot>
);