// Denna fil är till för att samla alla post-anrop som görs mot backend. På så sätt kan vi hålla koden mer organiserad och lättare att underhålla.

const API_BASE_URL = "http://localhost:8080/";

const postToApi = async (endpoint: string, body: unknown) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // Försök läsa felmeddelandet som backend skickar (ErrorResponse.message)
    let backendMessage: string | undefined;
    try {
      const errorBody = await res.json();
      backendMessage = errorBody?.message;
    } catch {
      // svaret var inte JSON, ignorera
    }

    if (backendMessage) {
      throw new Error(backendMessage);
    }

    switch (res.status) {
      case 404:
        throw new Error("Hittar inte resursen");
      case 401:
        throw new Error("Ej auktoriserad åtkomst");
      case 403:
        throw new Error("Förbjuden åtkomst");
      case 418:
        throw new Error("Servern är en teakopp");
      case 429:
        throw new Error("För många förfrågningar");
      case 500:
        throw new Error("Internt serverfel");
      case 502:
        throw new Error("Dålig gateway");
      case 503:
        throw new Error("Tjänsten är otillgänglig");
      default:
        throw new Error(`Oväntat fel: ${res.status}`);
    }
  }

  // Kastar vidare om nätverksfel/CORS sker, så att anroparen (UserForm) kan visa felet
  return await res.json();
};

export { postToApi };