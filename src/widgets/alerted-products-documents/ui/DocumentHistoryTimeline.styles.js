import styled from "@emotion/styled";
import { Button, Timeline } from "antd";

export const FullHistoryPanel = styled.section`
  display: grid;
  gap: 12px;
`;

export const HistoryTimeline = styled(Timeline)`
  .ant-timeline-item-content {
    min-height: 0;
    padding-bottom: 14px;
  }
`;

export const HistoryItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const HistoryItemContent = styled.div`
  display: grid;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

export const HistoryNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const HistoryName = styled.div`
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 700;
  word-break: break-word;
`;

export const HistoryActiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #15803d;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
`;

export const HistoryMeta = styled.div`
  color: #64748b;
  font-size: 0.76rem;
`;

export const HistoryUser = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 0.72rem;
  font-weight: 700;
`;

export const HistoryActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-items: center;
  padding-top: 2px;
`;

export const HistoryActionButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 10px;
    color: #1e3a8a;
    padding: 0;
    font-size: 1rem;
    border: 1px solid #bfdbfe;
    background: #eff6ff;
  }

  &&:hover,
  &&:focus {
    background: #dbeafe !important;
    border-color: #93c5fd !important;
    color: #1e40af !important;
  }
`;