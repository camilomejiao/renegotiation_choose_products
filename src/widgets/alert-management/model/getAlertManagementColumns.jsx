import {
  ActionsCell, GestionarButton, SubsanarButton, VerButton, HistorialButton,
} from "../ui/table.styles";
import { EN_SUBSANACION_GESTION_ID, formatDate, renderPill, wrapCell, wrapTitle } from "./alertManagementConstants";

export const getAlertManagementColumns = ({
  alertCategoryPillMap,
  alertManagementPillMap,
  canGestionar,
  canSubsanar,
  canVerHistorial,
  onGestionar,
  onSubsanar,
  onVer,
  onHistorial,
}) => [
  { title: "Jornada", dataIndex: "jornada", key: "jornada", width: 180, align: "center", ...wrapCell },
  { title: wrapTitle("Tipo de", "gestión"), dataIndex: "tipoGestion", key: "tipoGestion", width: 160, align: "center", ...wrapCell },
  {
    title: wrapTitle("Categoría", "alerta"), dataIndex: "categoriaAlerta", key: "categoriaAlerta",
    width: 170, align: "center",
    render: (v, r) => renderPill(v, r?.categoriaAlertaCodigo, alertCategoryPillMap),
  },
  { title: wrapTitle("Fecha de", "registro"), dataIndex: "fechaRegistro", key: "fechaRegistro", width: 150, align: "center", render: formatDate },
  { title: wrapTitle("Observación", "justificativa"), dataIndex: "observacionJustificativa", key: "observacionJustificativa", width: 250, align: "center", render: (v) => v || "—", ...wrapCell },
  { title: wrapTitle("Observación", "revisor"), dataIndex: "observacionRevisor", key: "observacionRevisor", width: 250, align: "center", render: (v) => v || "—", ...wrapCell },
  { title: wrapTitle("Rol", "revisor"), dataIndex: "rolRevisor", key: "rolRevisor", width: 150, align: "center", render: (v) => v || "—", ...wrapCell },
  {
    title: wrapTitle("Gestión", "alerta"), dataIndex: "gestionAlerta", key: "gestionAlerta",
    width: 160, align: "center",
    render: (v, r) => renderPill(v, r?.gestionAlertaCodigo, alertManagementPillMap),
  },
  {
    title: "Acciones", key: "actions", width: 160, align: "center", fixed: "right",
    render: (_, record) => {
      const isEnSubsanacion = Number(record?.gestionAlertaCodigo) === EN_SUBSANACION_GESTION_ID;
      return (
        <ActionsCell>
          {canGestionar && <GestionarButton onClick={() => onGestionar(record)}>Gestionar</GestionarButton>}
          {canSubsanar && isEnSubsanacion && <SubsanarButton onClick={() => onSubsanar(record)}>Subsanar</SubsanarButton>}
          {canVerHistorial && <VerButton onClick={() => onVer(record)}>Ver</VerButton>}
          {canVerHistorial && <HistorialButton onClick={() => onHistorial(record)}>Historial</HistorialButton>}
        </ActionsCell>
      );
    },
  },
];