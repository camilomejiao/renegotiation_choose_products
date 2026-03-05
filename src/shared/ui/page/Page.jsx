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
        <PageHeader>
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
  min-height: ${({ $minHeight }) => $minHeight};
  background: transparent;
`;

const PageHeader = styled.header`
  padding: 24px 24px 0;
  margin-bottom: -12px;

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

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;
