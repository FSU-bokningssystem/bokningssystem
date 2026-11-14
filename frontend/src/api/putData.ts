// Denna fil är till för att samla alla put-anrop som görs mot backend.

import { apiRequest } from "./apiClient";

const putToApi = async <T>(endpoint: string, body: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

export { putToApi };