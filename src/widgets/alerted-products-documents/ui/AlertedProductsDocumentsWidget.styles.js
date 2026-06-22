import styled from "@emotion/styled";
import { Button, Card, Timeline, Upload } from "antd";
import { AppTabs } from "../../../shared/ui/tabs";

export const DocumentsShell = styled(Card)`
  border-radius: 20px;
  border: 1px solid #dbe4f0;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  height: 920px;
  max-height: 1060px;
  overflow: hidden;

  .ant-card-body {
    display: grid;
    grid-template-rows: 1fr;
    padding: 20px 18px 24px;
    height: 100%;
    max-height: 868px;
    overflow: hidden;
  }
`;

export const DocumentsRoot = styled.section`
  display: grid;
  gap: 8px;
  min-height: 0;
`;

export const DocumentsIntro = styled.div`
  display: grid;
  gap: 6px;
`;

export const DocumentsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
`;

export const DocumentsHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  font-size: 1rem;
`;

export const DocumentsTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
`;

export const DocumentsDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const DocumentsTabs = styled(AppTabs)`
  margin-top: 0;
  padding: 0;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: 100%;

  .ant-card {
    border-radius: 18px;
    border: 1px solid #dbe4f0;
    box-shadow: none;
    height: 100%;
    min-width: 0;
  }

  .ant-card-body {
    padding: 0;
    height: 100%;
    min-width: 0;
  }

  .ant-tabs {
    height: 100%;
    min-width: 0;
  }

  .ant-tabs-nav {
    margin: 0 0 6px;
    padding: 0 16px;
    min-height: 0;
  }

  .ant-tabs-tab {
    min-height: 32px;
    padding: 6px 4px;
    font-weight: 700;
  }

  .ant-tabs-content-holder {
    padding: 8px 16px 24px;
    border-top: 1px solid #e2e8f0;
    min-height: 0;
    min-width: 0;
    overflow-y: auto;
  }

  .ant-tabs-content,
  .ant-tabs-tabpane {
    height: 100%;
    min-height: 0;
  }

  .ant-tabs-tabpane {
    overflow: visible;
  }
`;

export const UploadPanel = styled.section`
  display: grid;
  gap: 14px;
  align-content: start;
`;

export const UploadSlotHeader = styled.div`
  display: grid;
  gap: 4px;
`;

export const UploadSlotTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const UploadSlotTitle = styled.h4`
  margin: 0;
  color: #0f172a;
  font-size: 0.92rem;
  font-weight: 700;
`;

export const UploadSlotHint = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.4;
`;

export const SlotBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const DocumentsUpload = styled(Upload.Dragger)`
  .ant-upload {
    padding: 16px 14px !important;
  }

  &.ant-upload-wrapper .ant-upload-drag {
    border-radius: 16px;
    border: 1px dashed #99abe6;
    background: #f8fbff;
    transition: all 0.2s ease;
  }

  &.ant-upload-wrapper:hover .ant-upload-drag,
  &.ant-upload-wrapper .ant-upload-drag-hover {
    border-color: #1e3a8a;
    background: #eff6ff;
  }

  .ant-upload-btn {
    padding: 0 !important;
  }
`;

export const UploadInner = styled.div`
  display: grid;
  gap: 10px;
  justify-items: center;
  text-align: center;
`;

export const UploadIconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #1e3a8a;
  color: #ffffff;
  font-size: 1.15rem;
  box-shadow: 0 12px 24px rgba(30, 58, 138, 0.18);
`;

export const UploadTitle = styled.div`
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 700;
`;

export const UploadMeta = styled.div`
  color: #64748b;
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const UploadErrorText = styled.div`
  color: #b91c1c;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const HistoryLinkRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

export const SaveDocumentsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
  margin-bottom: -6px;
`;

export const SaveRequirements = styled.div`
  display: grid;
  gap: 6px;
  padding-top: 4px;
`;

export const SaveRequirementItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $isMet }) => ($isMet ? "#334155" : "#94a3b8")};
  font-size: 0.84rem;
  font-weight: 600;
`;

export const SaveRequirementIndicator = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $isMet }) => ($isMet ? "#86efac" : "#cbd5e1")};
  background: ${({ $isMet }) => ($isMet ? "#f0fdf4" : "#f8fafc")};
  color: ${({ $isMet }) => ($isMet ? "#16a34a" : "#94a3b8")};
  font-size: 0.72rem;
  flex: 0 0 auto;
`;

export const HistoryLinkButton = styled(Button)`
  && {
    padding-inline: 0;
    color: #1e3a8a;
    font-weight: 700;
  }
`;

export const UploadButton = styled(Button)`
  && {
    height: 42px;
    border-radius: 12px;
    border-color: #1e3a8a;
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
    box-shadow: none;
  }

  &&:hover,
  &&:focus {
    border-color: #1e40af;
    background: #1e40af;
    color: #ffffff;
  }
`;

export const SaveDocumentsButton = styled(Button)`
  && {
    height: 42px;
    border-radius: 12px;
    border-color: #1e3a8a;
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
    box-shadow: none;
  }

  &&:hover,
  &&:focus {
    border-color: #1e40af;
    background: #1e40af;
    color: #ffffff;
  }

  &&[disabled],
  &&[disabled]:hover,
  &&[disabled]:focus,
  &&.ant-btn-disabled,
  &&.ant-btn-disabled:hover,
  &&.ant-btn-disabled:focus {
    border-color: #cbd5e1 !important;
    background: #e2e8f0 !important;
    color: #94a3b8 !important;
    box-shadow: none !important;
  }
`;

export const FilesSection = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
`;

export const FilesTitle = styled.h4`
  margin: 0;
  color: #334155;
  font-size: 0.88rem;
  font-weight: 700;
`;

export const EmptyFilesState = styled.div`
  border-radius: 14px;
  border: 1px dashed #dbe4f0;
  background: #ffffff;
  padding: 14px 16px;
  color: #64748b;
  font-size: 0.88rem;
  align-self: start;
`;

export const FileList = styled.div`
  display: grid;
  gap: 10px;
`;

export const FileCurrentSection = styled.div`
  display: grid;
  gap: 8px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #dbe4f0;
  background: #ffffff;
`;

export const FileTypeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-width: 52px;
  padding: 3px 9px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e3a8a;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const FileMain = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

export const FileName = styled.div`
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 700;
  min-height: 36px;
  line-height: 18px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
`;

export const FileMeta = styled.div`
  color: #64748b;
  font-size: 0.74rem;
`;

export const RemoveFileButton = styled(Button)`
  && {
    border: none;
    box-shadow: none;
    color: #64748b;
  }

  &&:hover,
  &&:focus {
    color: #dc2626;
    background: #fef2f2;
  }
`;

export const HistorySection = styled.div`
  display: grid;
  gap: 8px;
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

export const FullHistoryTabs = styled(AppTabs)`
  padding: 0;

  .ant-card {
    border: none;
    box-shadow: none;
  }

  .ant-card-body {
    padding: 0;
  }

  .ant-tabs-nav {
    margin-bottom: 16px;
  }
`;

export const FullHistoryPanel = styled.section`
  display: grid;
  gap: 12px;
`;

export const FullHistoryEmpty = styled.div`
  border-radius: 14px;
  border: 1px dashed #dbe4f0;
  background: #f8fafc;
  padding: 16px;
  color: #64748b;
  font-size: 0.88rem;
`;
