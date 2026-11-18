// Denna fil är till för att samla alla patch-anrop som görs mot backend.
import { apiRequest } from "./apiClient";

const patchToApi = async <T>(endpoint: string, body: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

export { patchToApi };