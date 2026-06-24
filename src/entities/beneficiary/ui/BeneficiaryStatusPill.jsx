import { getTitularStatusColor } from "../model/selectors";
import { StatusPill } from "../../../shared/ui/status-pill";

export const BeneficiaryStatusPill = ({ status }) => (
  <StatusPill color={getTitularStatusColor(status)} padding="4px 10px">
    {status || "---"}
  </StatusPill>
);
