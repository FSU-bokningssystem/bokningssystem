// Denna fil är till för att samla alla delete-anrop som görs mot backend.
// Delete-anrop ska inte ha någon body utan ska ha allt i själva URI:en, t ex "http://localhost:8080/booking/1".
// Behövs flera argument (t ex alla meddelanden från användare 1 till användare 3 ska det se ut som "http://localhost:8080/message/1/3")
// Skulle det behöva vara så komplicerat att man behöver en hel payload (vilket det inte borde) får man göra det som en PUT i stället.

const API_BASE_URL = "http://localhost:8080/";

const deleteToApi = async (endpoint: string, arg: string) => {
	const res = await fetch(`${API_BASE_URL}${endpoint}/${arg}`, {
		method: "DELETE",
	});

	/* När AWT är på plats ska det läggas in följande efter method: "DELETE", :
    headers: {
      Authorization: `Bearer ${token}`,
    }, */

	if (!res.ok) {
		let message = `Oväntat fel: ${res.status}`;
		try {
			const err = await res.json();
			if (err?.message) message = err.message; // ErrorResponse från backend
		} catch {
			// svaret var inte JSON, behåll standardmeddelandet
		}
		throw new Error(message);
	}

	if (res.status === 204) {
		return null;
	}
	const contentType = res.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		return res.json();
	}

	return null;
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
export { deleteToApi };
