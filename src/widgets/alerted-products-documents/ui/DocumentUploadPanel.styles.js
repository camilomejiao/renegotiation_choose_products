import styled from "@emotion/styled";
import { Button, Upload } from "antd";

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