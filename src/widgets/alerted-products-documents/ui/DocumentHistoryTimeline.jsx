import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { extractDocumentPartName, formatTimestamp } from "../lib/format";
import { FullHistoryEmpty } from "./common.styles";
import {
  FullHistoryPanel,
  HistoryActionButton,
  HistoryActions,
  HistoryActiveBadge,
  HistoryItem,
  HistoryItemContent,
  HistoryMeta,
  HistoryName,
  HistoryNameRow,
  HistoryTimeline,
  HistoryUser,
} from "./DocumentHistoryTimeline.styles";

export const DocumentHistoryTimeline = ({ history, isPdf, onView, onDownload }) => {
  if (!history.length) {
    return (
      <FullHistoryEmpty>
        No hay registros en el historial de {isPdf ? "PDF" : "Excel"}.
      </FullHistoryEmpty>
    );
  }

  return (
    <FullHistoryPanel>
      <HistoryTimeline
        items={history.map((item, index) => {
          const isActive = index === 0;
          return {
            color: isActive ? "green" : "blue",
            children: (
              <HistoryItem key={item.uid}>
                <HistoryItemContent>
                  <HistoryNameRow>
                    <HistoryName>{extractDocumentPartName(item.name)}</HistoryName>
                    {isActive && <HistoryActiveBadge>Activo</HistoryActiveBadge>}
                  </HistoryNameRow>
                  <HistoryMeta>
                    <strong>Versión {history.length - index}</strong> ·{" "}
                    {formatTimestamp(item.uploadedAt)}
                  </HistoryMeta>
                  <HistoryUser>{item.user || "---"}</HistoryUser>
                </HistoryItemContent>
                {item.route ? (
                  <HistoryActions>
                    {isPdf && (
                      <Tooltip title="Visualizar">
                        <HistoryActionButton
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => onView(item)}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Descargar">
                      <HistoryActionButton
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => onDownload(item)}
                      />
                    </Tooltip>
                  </HistoryActions>
                ) : null}
              </HistoryItem>
            ),
          };
        })}
      />
    </FullHistoryPanel>
  );
};