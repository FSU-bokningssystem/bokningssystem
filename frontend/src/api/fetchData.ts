// Denna fil är till för att samla alla fetch-anrop som görs mot backend. På så sätt kan vi hålla koden mer organiserad och lättare att underhålla.

const API_BASE_URL = "http://localhost:8080/";

const fetchFromApi = async (endpoint: string) => {
	try {
		const res = await fetch(`${API_BASE_URL}${endpoint}`);
		if (!res.ok) {
			const errorData = await res.json();
			switch (errorData.status) {
				case 404:
					throw new Error(`Hittar inte data: ${errorData.message}`);
				case 401:
					throw new Error(`Ej auktoriserad åtkomst: ${errorData.message}`);
				case 403:
					throw new Error(`Förbjuden åtkomst: ${errorData.message}`);
				case 418:
					throw new Error(`Servern är en teakopp: ${errorData}`);
				case 429:
					throw new Error(`För många förfrågningar: ${errorData.message}`);
				case 500:
					throw new Error(`Internt serverfel: ${errorData.message}`);
				case 502:
					throw new Error(`Dålig gateway: ${errorData.message}`);
				case 503:
					throw new Error(`Tjänsten är otillgänglig: +${errorData.message}`);
				default:
					throw new Error(
						`Oväntat fel: ${errorData.status}: ${errorData.message}`,
					);
			}
		}
		const data = await res.json();
		return data;
	} catch (error) {
		throw error;
	}
};

export { fetchFromApi };
