// Denna fil är till för att samla alla fetch-anrop som görs mot backend. På så sätt kan vi hålla koden mer organiserad och lättare att underhålla.
import { apiRequest } from "./apiClient";

const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  return apiRequest<T>(endpoint, { method: "GET" });
};

export { fetchFromApi };