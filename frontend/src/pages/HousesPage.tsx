import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import HouseList from "../components/House/HouseList";
import LoadingSpinner from "../UI/LoadingSpinner";
import type { houseData } from "../types/types";
import { useAuth } from "../context/AuthContext";
import AddHouseButton from "../components/House/AddHouseButton";

const HousesPage = () => {
  const auth = useAuth();
  const { activeOrganization } = auth;
  const orgHouseIds = new Set(activeOrganization?.houses.map((h) => h.id) ?? []);
  
  const {
	data: houselist,
	isLoading,
	error,
  } = useQuery({
	  queryKey: ["houses"],
	  queryFn: () => fetchFromApi<houseData[]>("house"),
  });

  const filteredHouses = houselist?.filter((house) => orgHouseIds.has(house.id)) || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

	const canAddHouse = () => {
		const isAdmin = auth.userRole === "ADMIN";
		const roleInActiveOrg = auth.userOrganizations.find(
			(org) => org.id === auth.activeOrganization?.id,
		)?.memberRole;
		const isOrgOwnerorAdmin =
			roleInActiveOrg === "OWNER" || roleInActiveOrg === "ADMIN";
		return isAdmin || isOrgOwnerorAdmin;
	};

  return (
		<div className="space-y-6">
			{/* Topprad: Rubrik till vänster, knapp till höger */}
			<div className="flex items-start justify-between gap-4">
				{filteredHouses.length === 0 ? (
					<h1 className="text-2xl font-bold text-gray-900">
						Det saknas hus som tillhör {activeOrganization?.name}
					</h1>
				) : (
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							Alla Hus tillhörande {activeOrganization?.name}
						</h1>
						<p className="text-sm text-gray-500">
							Välj ett hus för att se dess lokaler och detaljer
						</p>
					</div>
				)}

				{canAddHouse() && <AddHouseButton />}
			</div>

			{/* Korten visas under toppraden över hela bredden */}
			{filteredHouses.length > 0 && <HouseList houses={filteredHouses} />}
		</div>
	);
};

export default HousesPage;