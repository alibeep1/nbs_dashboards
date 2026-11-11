import axios from "axios";

export const createApiClient = (token: string) => {
  return axios.create({
    // baseURL: "https://localhost:7031/api",
    // baseURL: "https://dev.api.neptontech.co.uk/api",
    baseURL: "https://prod.api.neptontech.co.uk/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
