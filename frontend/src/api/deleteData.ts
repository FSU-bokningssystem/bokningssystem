const API_BASE_URL = "http://localhost:8080/";

const deleteFromApi = async (endpoint: string, actorId: number) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: { "X-User-Id": String(actorId) }, // tillfälligt tills vi har riktig inloggning
  });

  if (!res.ok) {
    let message = `Oväntat fel: ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) message = err.message;
    } catch {
      /* inte JSON */
    }
    const error = new Error(message) as Error & { status: number };
    error.status = res.status; // så att UI:t kan skilja 409 från 403
    throw error;
  }
  // 204 No Content → ingen body, anropa INTE res.json() här
};

export { deleteFromApi };
