import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import HouseList from "../components/House/HouseList";
import LoadingSpinner from "../UI/LoadingSpinner";
import type { houseData } from "../types/types";

const HousesPage = () => {
  const {
    data: houselist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: () => fetchFromApi<houseData[]>("house"),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alla Hus</h1>
        <p className="text-sm text-gray-500">Välj ett hus för att se dess lokaler och detaljer</p>
      </div>
      <HouseList houses={houselist || []} />
    </div>
  );
};

export default HousesPage;