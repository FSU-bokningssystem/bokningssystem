import { apiRequest } from "./apiClient";

const deleteFromApi = async (endpoint: string, actorId?: number): Promise<void> => {
  const headers: Record<string, string> = {};
  if (actorId !== undefined) {
    headers["X-User-Id"] = String(actorId); // Kan tas bort helt när backend enbart läser JWT
  }

  return apiRequest<void>(endpoint, {
    method: "DELETE",
    headers,
  });
};

export { deleteFromApi };