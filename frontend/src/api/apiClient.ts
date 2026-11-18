const API_BASE_URL = "http://localhost:8080/";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Om token har gått ut eller är ogiltig (men INTE vid felaktigt lösenord på /auth/login)
  if (res.status === 401 && !endpoint.startsWith("auth/")) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sessionen har gått ut, vänligen logga in igen");
  }

  if (!res.ok) {
    let message = `Oväntat fel: ${res.status}`;
    try {
      const errorBody = await res.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
    } catch {
      // Svaret var inte JSON, behåll standardmeddelandet
    }

    const error = new Error(message) as Error & { status: number };
    error.status = res.status; // Behåller ert stöd för t.ex. 409 vs 403
    throw error;
  }

  // Hanterar 204 No Content (t.ex. vid DELETE) utan att krascha på res.json()
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}