import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import HouseList from "../components/House/HouseList";
import LoadingSpinner from "../UI/LoadingSpinner";

const HousesPage = () => {
	const {
		data: houselist,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["houses"],
		queryFn: () => fetchFromApi("house"),
	});
	if (isLoading) return <LoadingSpinner />;
	if (error) return <p>Ett fel uppstod: {error.message}</p>;

	return (
		<>
			<HouseList houses={houselist || []} />
		</>
	);
};

export default HousesPage;
