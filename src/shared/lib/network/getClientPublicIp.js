const PUBLIC_IP_API_URL =
  process.env.REACT_APP_PUBLIC_IP_API_URL || "https://api.ipify.org?format=json";

let cachedIp = "";
let pendingIpRequest = null;

const normalizeIpResponse = (response) => {
  if (!response || typeof response.ip !== "string") {
    return "";
  }

  return response.ip.trim();
};

export const getClientPublicIp = async () => {
  if (cachedIp) {
    return cachedIp;
  }

  if (pendingIpRequest) {
    return pendingIpRequest;
  }

  pendingIpRequest = fetch(PUBLIC_IP_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        return "";
      }

      const data = await response.json();
      const nextIp = normalizeIpResponse(data);

      if (nextIp) {
        cachedIp = nextIp;
      }

      return nextIp;
    })
    .catch(() => "")
    .finally(() => {
      pendingIpRequest = null;
    });

  return pendingIpRequest;
};
