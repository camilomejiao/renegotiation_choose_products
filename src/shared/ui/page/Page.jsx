import { useEffect } from "react";
import { Breadcrumb, Col, Row, Space, Typography } from "antd";
import styled from "@emotion/styled";

const { Title } = Typography;

export const Page = ({
  showPageHeader = false,
  header = {},
  content,
  children,
  minHeight = "calc(100vh - 290px)",
  contentPadding = "24px",
  headerPaddingTop = "24px",
  headerMarginBottom = "-12px",
}) => {
  const { appName = "", title, subTitle, breadcrumbs = [], extra } = header;

  useEffect(() => {
    if (!appName && !title) {
      return;
    }

    document.title = `${appName}${title ? ` - ${title}` : ""}`;
  }, [title, appName]);

  const resolvedContent = content ?? children;

  return (
    <PageRoot $minHeight={minHeight}>
      {showPageHeader && (
        <PageHeader
          $paddingTop={headerPaddingTop}
          $marginBottom={headerMarginBottom}
        >
          <Row justify="space-between" align="middle" gutter={[12, 12]}>
            <Col flex="auto">
              <Space direction="vertical" size={2}>
                <Breadcrumb items={breadcrumbs} />
                <Space align="center" wrap>
                  <PageTitle level={4}>{title}</PageTitle>
                  {subTitle}
                </Space>
              </Space>
            </Col>
            <Col>{extra}</Col>
          </Row>
        </PageHeader>
      )}

      <PageContent $padding={contentPadding}>{resolvedContent}</PageContent>
    </PageRoot>
  );
};

const PageRoot = styled.section`
  width: 100%;
  max-width: 100%;
  min-height: ${({ $minHeight }) => $minHeight};
  background: transparent;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const PageHeader = styled.header`
  padding: ${({ $paddingTop }) => $paddingTop} 24px 0;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};

  @media (max-width: 768px) {
    padding: 16px 12px 0;
    margin-bottom: 0;
  }
`;

const PageTitle = styled(Title)`
  && {
    margin: 0;
  }
`;

const PageContent = styled.main`
  padding: ${({ $padding }) => $padding};
  display: flex;
  flex-direction: column;
  gap: var(--space-7, 32px);
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
  flex: 1 0 auto;

  @media (max-width: 768px) {
    padding: 16px 12px;
    gap: var(--space-5, 20px);
  }
`;
