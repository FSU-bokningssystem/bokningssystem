import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import HouseList from "../components/House/HouseList";
import LoadingSpinner from "../UI/LoadingSpinner";
import type { houseData } from "../types/types";
import { useAuth } from "../context/AuthContext";
import AddHouseButton from "../components/House/AddHouseButton";

const HousesPage = () => {
	const auth = useAuth();
	console.log(auth);
	const {
		data: houselist,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["houses"],
		queryFn: () => fetchFromApi<houseData[]>("house"),
	});

	if (isLoading) return <LoadingSpinner />;
	if (error)
		return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

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
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Alla Hus</h1>
					<p className="text-sm text-gray-500">
						Välj ett hus för att se dess lokaler och detaljer
					</p>
				</div>
				<div>{canAddHouse() ? <AddHouseButton /> : null}</div>
			</div>
			<HouseList houses={houselist || []} />
		</div>
	);
};

export default HousesPage;
