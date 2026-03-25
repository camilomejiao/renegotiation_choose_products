import { CATALOG_ITEM_STATUS } from "./constants";

export const isCatalogItemOpen = (item) => item?.status === CATALOG_ITEM_STATUS.OPEN;

export const isCatalogItemClosed = (item) => item?.status === CATALOG_ITEM_STATUS.CLOSED;
