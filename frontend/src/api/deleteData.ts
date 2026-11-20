import { apiRequest } from "./apiClient";

const deleteFromApi = async (endpoint: string): Promise<void> => {
	return apiRequest<void>(endpoint, {
		method: "DELETE",
	});
};

export { deleteFromApi };
