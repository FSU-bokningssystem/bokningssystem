// Denna fil är till för att samla alla post-anrop som görs mot backend. På så sätt kan vi hålla koden mer organiserad och lättare att underhålla.

const API_BASE_URL = "http://localhost:8080/";

const postToApi = async (endpoint: string, body: unknown) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      switch (res.status) {
        case 404:
          throw new Error("Hittar inte användarlistan");
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
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export { postToApi };
