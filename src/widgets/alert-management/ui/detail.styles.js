import styled from "@emotion/styled";
import { Button, Card, Input } from "antd";

export const DetailViewRoot = styled.div`display: grid; gap: 16px;`;
export const DetailBackButton = styled(Button)`
  && { width: fit-content; height: 40px; border-radius: 12px; border-color: #cbd5e1; background: #ffffff; color: #334155; font-weight: 700; box-shadow: none; }
`;
export const DetailTopGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
export const DetailMetaCard = styled(Card)`
  border-radius: 18px; border: 1px solid #dbe4f0; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  .ant-card-body { padding: 16px 18px; display: grid; gap: 6px; }
`;
export const DetailMetaLabel = styled.span`color: #64748b; font-size: 0.78rem; font-weight: 700;`;
export const DetailMetaValue = styled.span`color: #0f172a; font-size: 0.95rem; font-weight: 800;`;
export const DetailGrid = styled.div`
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); gap: 16px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;
export const DetailSectionCard = styled(Card)`
  border-radius: 20px; border: 1px solid #dbe4f0; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  .ant-card-body { padding: 18px; display: grid; gap: 14px; }
`;
export const DetailSectionTitle = styled.h3`margin: 0; font-size: 1rem; font-weight: 800; color: #0f172a;`;
export const DetailDocsList = styled.div`display: grid; gap: 12px;`;
export const DetailDocItem = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;
  border: 1px solid #dbe4f0; border-radius: 16px; padding: 14px 16px; background: #f8fafc;
`;
export const DetailDocInfo = styled.div`display: grid; gap: 4px; min-width: 0;`;
export const DetailDocName = styled.span`color: #1e3a8a; font-size: 0.93rem; font-weight: 800; word-break: break-word;`;
export const DetailDocMeta = styled.span`color: #64748b; font-size: 0.8rem;`;
export const DetailDocActions = styled.div`display: flex; gap: 8px; flex-wrap: nowrap;`;
export const DetailDocButton = styled(Button)`
  && { height: 38px; min-width: 42px; border-radius: 10px; border-color: #c7d2fe; color: #1d4ed8; background: #ffffff; box-shadow: none; }
`;
export const DetailObservationBox = styled.div`
  min-height: 88px; border: 1px solid #dbe4f0; border-radius: 14px; padding: 14px 16px;
  background: #f8fafc; color: #0f172a; line-height: 1.6;
`;
export const DetailTimeline = styled.div`display: grid; gap: 12px;`;
export const DetailTimelineItem = styled.div`
  display: grid; gap: 6px; padding: 14px 16px; border-radius: 16px;
  background: ${({ $tone }) => ($tone === "orange" ? "#fff7ed" : "#eff6ff")};
  border-left: 4px solid ${({ $tone }) => ($tone === "orange" ? "#f97316" : "#1d4ed8")};
`;
export const DetailTimelineTitle = styled.span`color: #0f172a; font-size: 0.95rem; font-weight: 800;`;
export const DetailTimelineMeta = styled.span`color: #64748b; font-size: 0.78rem; font-weight: 700;`;
export const DetailProductsTable = styled.div`border: 1px solid #dbe4f0; border-radius: 16px; overflow: hidden; background: #ffffff;`;
export const DetailProductsTableHead = styled.div`
  display: grid; grid-template-columns: 1.15fr 1.8fr 1fr 1fr 1fr 1fr; gap: 16px;
  padding: 14px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  color: #1e3a8a; font-size: 0.82rem; font-weight: 800;
  @media (max-width: 920px) { display: none; }
`;
export const DetailProductsRow = styled.div`
  display: grid; grid-template-columns: 1.15fr 1.8fr 1fr 1fr 1fr 1fr; gap: 16px;
  padding: 14px 16px; color: #0f172a; font-size: 0.86rem; border-bottom: 1px solid #e2e8f0;
  &:last-child { border-bottom: none; }
  @media (max-width: 920px) { grid-template-columns: 1fr; gap: 8px; }
`;
export const ReviewActionsRow = styled.div`display: flex; justify-content: flex-end; gap: 10px; flex-wrap: wrap;`;
const reviewBase = `&& { height: 40px; min-width: 140px; border-radius: 12px; font-weight: 800; box-shadow: none; }`;
export const WithObservationButton = styled(Button)`${reviewBase} && { border-color: #f97316; background: #f97316; color: #ffffff; }`;
export const WithoutObservationButton = styled(Button)`${reviewBase} && { border-color: #16a34a; background: #16a34a; color: #ffffff; }`;
export const ReviewPanel = styled(Card)`
  border-radius: 20px; border: 2px solid #dbe4f0; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  .ant-card-body { padding: 18px; display: grid; gap: 14px; }
`;
export const ReviewFieldLabel = styled.label`color: #334155; font-size: 0.82rem; font-weight: 800;`;
export const ReviewTextArea = styled(Input.TextArea)`
  && { border-radius: 14px; border-color: #cbd5e1; min-height: 120px; resize: vertical; padding: 12px 14px; }
`;
export const ReviewUploadBox = styled.label`display: grid; gap: 8px; border: 1px solid #cbd5e1; border-radius: 14px; padding: 12px 14px; background: #ffffff; cursor: pointer;`;
export const ReviewUploadInput = styled.input`display: none;`;
export const ReviewUploadText = styled.span`color: #475569; font-size: 0.84rem;`;
export const ReviewSubmitRow = styled.div`display: flex; justify-content: flex-end;`;
export const ReviewSubmitButton = styled(Button)`
  && { height: 40px; min-width: 180px; border-radius: 12px; border-color: #f97316; background: #f97316; color: #ffffff; font-weight: 800; box-shadow: none; }
`;