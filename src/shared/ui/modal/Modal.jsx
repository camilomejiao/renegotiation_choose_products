import { Modal as AntdModal, Skeleton, Space, Typography } from "antd";
import styled from "@emotion/styled";

const { Title, Text } = Typography;

export const Modal = ({
  title = <></>,
  subTitle = <></>,
  isLoading = false,
  isOpen = false,
  onCloseModal = () => {},
  children,
  footer = null,
  width = 520,
  centered = false,
  destroyOnClose = false,
  maxBodyHeight = "70vh",
}) => {
  return (
    <StyledModal
      destroyOnClose={destroyOnClose}
      $maxBodyHeight={maxBodyHeight}
      title={
        !isLoading && (
          <HeaderSpace wrap direction="vertical">
            <HeaderTitle level={4}>{title}</HeaderTitle>
            <Text type="secondary">{subTitle}</Text>
          </HeaderSpace>
        )
      }
      open={isOpen}
      width={width}
      footer={footer}
      centered={centered}
      onCancel={onCloseModal}
    >
      <Skeleton
        active
        loading={isLoading}
        title
        paragraph={{ rows: 3, width: "100%" }}
      >
        {children}
      </Skeleton>
    </StyledModal>
  );
};

const HeaderTitle = styled(Title)`
  && {
    margin: 0;
  }
`;

const HeaderSpace = styled(Space)`
  gap: 4px;
`;

const StyledModal = styled(AntdModal)`
  .ant-modal-body {
    max-height: ${({ $maxBodyHeight }) => $maxBodyHeight};
    overflow-y: auto;
    overflow-x: hidden;
  }
`;
