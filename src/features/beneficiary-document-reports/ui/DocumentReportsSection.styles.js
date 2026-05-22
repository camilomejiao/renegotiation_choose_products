import styled from "@emotion/styled";
import { Button } from "antd";

export const DocumentActionButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #1677ff;
    border-color: #1677ff;
    box-shadow: none;
  }

  &&:hover,
  &&:focus {
    background: #4096ff;
    border-color: #4096ff;
  }

  &&[disabled],
  &&[disabled]:hover {
    background: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
  }
`;

export const ViewerFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ViewerFrame = styled.iframe`
  width: 100%;
  height: 70vh;
  border: 0;
`;
