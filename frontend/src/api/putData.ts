// Denna fil är till för att samla alla put-anrop som görs mot backend.

const API_BASE_URL = "http://localhost:8080/";

const putToApi = async (endpoint: string, body: unknown) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

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

    return res.json();
};

export { putToApi };
