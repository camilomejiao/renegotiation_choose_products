import { Tabs } from "antd";
import { TabsCard, TabsContainer } from "./AppTabs.styles";

export const AppTabs = ({ className, tabsProps, children }) => {
  const resolvedChildren = children ?? <Tabs {...tabsProps} />;

  return (
    <TabsContainer className={className}>
      <TabsCard>{resolvedChildren}</TabsCard>
    </TabsContainer>
  );
};
