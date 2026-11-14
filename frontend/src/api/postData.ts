// Denna fil är till för att samla alla post-anrop som görs mot backend. På så sätt kan vi hålla koden mer organiserad och lättare att underhålla.
import { apiRequest } from "./apiClient";

const postToApi = async <T>(endpoint: string, body: unknown): Promise<T> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export { postToApi };