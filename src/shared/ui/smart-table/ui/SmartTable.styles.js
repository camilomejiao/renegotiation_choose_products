import styled from "@emotion/styled";
import { Divider, Flex } from "antd";

export const TableRoot = styled(Flex)`
  width: 100%;
`;

export const ToolbarRow = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LeftToolbar = styled(Flex)`
  min-width: 0;
  flex: 1;
`;

export const RightToolbar = styled(Flex)`
  margin-left: auto;
`;

export const ToolbarDivider = styled(Divider)`
  margin: 0;
`;

export const EmptySpace = styled.div`
  min-width: 1px;
`;

export const TableContainer = styled.div`
  .shared-smart-table-danger-row > td {
    background: ${({ $dangerRowBg }) => $dangerRowBg} !important;
    border-top: 1px solid ${({ $dangerRowBorder }) => $dangerRowBorder};
    border-bottom: 1px solid ${({ $dangerRowBorder }) => $dangerRowBorder};
  }

  .shared-smart-table-danger-row:hover > td {
    background: ${({ $dangerRowHoverBg }) => $dangerRowHoverBg} !important;
  }

  .shared-smart-table-danger-row td:first-of-type {
    border-left: 4px solid ${({ $dangerRowAccent }) => $dangerRowAccent};
  }

  .shared-smart-table-success-row > td {
    background: ${({ $successRowBg }) => $successRowBg} !important;
    border-top: 1px solid ${({ $successRowBorder }) => $successRowBorder};
    border-bottom: 1px solid ${({ $successRowBorder }) => $successRowBorder};
  }

  .shared-smart-table-success-row:hover > td {
    background: ${({ $successRowHoverBg }) => $successRowHoverBg} !important;
  }

  .shared-smart-table-success-row td:first-of-type {
    border-left: 4px solid ${({ $successRowAccent }) => $successRowAccent};
  }
`;
