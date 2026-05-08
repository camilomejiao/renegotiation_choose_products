import { getOrderSearchError } from "./orderSearch";

export { normalizeOrderSearchValue as normalizeOrderDocumentSearchQuery } from "./orderSearch";

export const getOrderDocumentSearchError = (
  value,
  { allowEmpty = false } = {}
) =>
  getOrderSearchError(
    {
      field: "cedula",
      value,
    },
    { allowEmpty }
  );
