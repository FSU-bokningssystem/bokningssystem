import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams, Link } from "react-router-dom";
import RoomListItem from "../components/Room/RoomListItem";
import type { houseWithRoomsData } from "../types/types";
import LoadingSpinner from "../UI/LoadingSpinner";

const OneHousePage = () => {
	const { houseid } = useParams<{ houseid: string }>();
	const houseIdNbr = houseid ? parseInt(houseid) : null;
	const {
		data: theHouse,
		isLoading,
		error,
	} = useQuery<houseWithRoomsData>({
		queryKey: ["house"],
		queryFn: () => fetchFromApi("house/" + houseIdNbr),
	});
	if (isLoading) return <LoadingSpinner />;
	if (error) return <p>Ett fel uppstod: {error.message}</p>;
	if (!theHouse || houseIdNbr === null)
		return (
			<p>
				Inget hus valt, vänligen gå tillbaka till Hus och välj ett hus från
				listan.
			</p>
		);

	return (
		<div className="flex flex-col sm:flex-row align-start justify-content gap-4">
			<aside>
				<h2 className="font-sans text-white text-xl p-2 border-yellow-50 bg-indigo-900 rounded-2xl">
					<Link to={`/houses/${houseIdNbr}`}>Hussida</Link>
				</h2>
				<ul className="list-none p-2 m-2 gap-1 flex-column">
					{theHouse.rooms.map((room) => (
						<RoomListItem key={room.id} houseId={houseIdNbr} room={room} />
					))}
				</ul>
			</aside>
			<main>
				<Outlet context={theHouse} />
			</main>
		</div>
	);
};
export default OneHousePage;
