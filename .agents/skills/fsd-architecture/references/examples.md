# Project Examples

This reference file contains representative patterns from the project.

## Pages delegate to pages-layer

```jsx
import { Page } from "@ecs/ui-components";
import DashboardPage from "@/pages-layer/dashboard/DashboardPage";

export default function Dashboard() {
  return (
    <Page
      showPageHeader
      header={{ title: "Dashboard" }}
      content={<DashboardPage />}
    />
  );
}
```

## Pages-layer composes features and widgets

```jsx
import { DashboardScopeTabs } from "@/features/dashboard-scope-tabs/ui/DashboardScopeTabs";
import { DashboardMetricsWidget } from "@/widgets/dashboard-metrics";

export default function DashboardPage() {
  return (
    <>
      <DashboardScopeTabs />
      <DashboardMetricsWidget />
    </>
  );
}
```

## Widget model orchestrates entities

```js
import useGetTotalTransactions from "@/entities/total-transactions/api/get-total-transactions";
import { mapTotalTransactions } from "@/entities/total-transactions/model/map-total-transactions";

export default function useDashboardMetrics() {
  const total = useGetTotalTransactions();

  return {
    isLoading: total.isLoading,
    cards: [mapTotalTransactions(total.data)].filter(Boolean),
  };
}
```

## Entity API hook exposes raw data plus reload

```js
import { mutate } from "swr";
import useFetchFromApiRoute from "@/shared/api/useFetchFromApiRoute";

const ENDPOINT = "/api/dashboard/total-transactions";

export default function useGetTotalTransactions() {
  const { data, error, isLoading } = useFetchFromApiRoute(ENDPOINT, {}, "GET");

  const reload = () => {
    const keyMatch = (key) => key[0]?.startsWith(ENDPOINT);
    mutate(keyMatch, undefined, { revalidate: false });
    mutate(keyMatch, undefined, { revalidate: true });
  };

  return { data, isLoading, isError: error, reload };
}
```
