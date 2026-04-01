export const getValueByDataIndex = (record, dataIndex) => {
  if (!record || dataIndex === undefined || dataIndex === null) {
    return undefined;
  }

  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce((acc, key) => {
      if (acc === undefined || acc === null) {
        return undefined;
      }
      return acc[key];
    }, record);
  }

  return record[dataIndex];
};

export const dataIndexToKey = (dataIndex) => {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join(".");
  }

  return String(dataIndex);
};
