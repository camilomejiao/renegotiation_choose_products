import { matchPath } from "react-router-dom";

/**
 * Route-level layout contract.
 *
 * Each entry can override:
 * - contentMode: "legacy" | "fluid"
 * - renderHeader: (ctx) => ReactNode
 * - renderFooter: (ctx) => ReactNode
 */
export const privateLayoutRoutes = [
  {
    path: "/admin/list-products-by-convocation",
    contentMode: "fluid",
  },
  {
    path: "/admin/report-by-convocation",
    contentMode: "fluid",
  },
  {
    path: "/admin/edit-products-by-convocation/:id",
    contentMode: "fluid",
  },
  {
    path: "/admin/product-upload",
    contentMode: "fluid",
  },
  {
    path: "/admin/products-enviromental",
    contentMode: "fluid",
  },
];

export const resolvePrivateLayoutRoute = (pathname) => {
  return (
    privateLayoutRoutes.find((route) =>
      matchPath({ path: route.path, end: true }, pathname)
    ) || null
  );
};
