import styled from "@emotion/styled";
import { Button, Card } from "antd";

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

export const HistoryLinkRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

export const HistoryLinkButton = styled(Button)`
  && {
    padding-inline: 0;
    color: #1e3a8a;
    font-weight: 700;
  }
`;

export const SaveDocumentsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
  margin-bottom: -6px;
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

export const UploadErrorText = styled.div`
  color: #b91c1c;
  font-size: 0.8rem;
  font-weight: 600;
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

export const FullHistoryEmpty = styled.div`
  border-radius: 14px;
  border: 1px dashed #dbe4f0;
  background: #f8fafc;
  padding: 16px;
  color: #64748b;
  font-size: 0.88rem;
`;