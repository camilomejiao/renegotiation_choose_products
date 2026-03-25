const moneyFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("es-CO", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const formatByType = (type, value) => {
  if (value === null || value === undefined) {
    return value;
  }

  switch (type) {
    case "currency": {
      const amount = Number(value?.amount ?? value);
      if (Number.isNaN(amount)) {
        return value;
      }

      const currency = value?.currency ? `${value.currency} ` : "";
      return `${currency}${moneyFormatter.format(amount)}`;
    }

    case "date": {
      const date = normalizeDate(value);
      return date ? dateFormatter.format(date) : value;
    }

    case "time": {
      const date = normalizeDate(value);
      return date ? timeFormatter.format(date) : value;
    }

    case "timestamp": {
      const date = normalizeDate(value);
      return date ? dateTimeFormatter.format(date) : value;
    }

    case "datetime-in-timezone": {
      const date = normalizeDate(value?.date);
      if (!date) {
        return value;
      }

      const zone = value?.zone || "UTC";
      return new Intl.DateTimeFormat("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: zone,
        timeZoneName: "short",
      }).format(date);
    }

    default:
      return value;
  }
};
