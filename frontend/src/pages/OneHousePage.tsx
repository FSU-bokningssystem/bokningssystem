import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams, Link, NavLink } from "react-router-dom";
import RoomListItem from "../components/Room/RoomListItem";
import type { houseWithRoomsData } from "../types/types";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useState } from "react";
import { DoorClosed, ChevronLeft } from "lucide-react";

const OneHousePage = () => {
	const [toggle, setToggle] = useState(false);
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
			<aside className="hidden sm:block">
				<h2 className="font-sans text-white text-xl p-2 border-yellow-50 bg-indigo-900 rounded-2xl">
					<Link to={`/houses/${houseIdNbr}`}>Hussida</Link>
				</h2>
				<ul className="list-none p-2 m-2 gap-1 flex-column">
					{theHouse.rooms.map((room) => (
						<RoomListItem key={room.id} houseId={houseIdNbr} room={room} />
					))}
				</ul>
			</aside>
			{/* Mobile Navigation */}
			<div className="sm:hidden flex flex-1 justify-start items-start">
				{/* Meny-knapp med Lucide-ikon */}
				<button
					type="button"
					onClick={() => setToggle((prev) => !prev)}
					className="text-white p-2 focus:outline-none cursor-pointer"
					aria-label="Toggle Menu">
					{toggle ? (
						<ChevronLeft className="w-7 h-7" />
					) : (
						<DoorClosed className="w-7 h-7" />
					)}
				</button>

				{/* Dropdown / Sidebar för mobil */}
				<div
					className={`${
						!toggle ? "hidden" : "flex"
					} p-6 bg-slate-900 border border-slate-800 top-16 left-0 mx-4 my-2 min-w-[180px] rounded-xl shadow-xl z-50`}>
					<ul className="list-none flex flex-col justify-start items-start flex-1 gap-4 w-full">
						{theHouse.rooms.map((room) => {
							return (
								<li key={room.roomNumber} className="w-full">
									<NavLink
										to={`/houses/${houseid}/${room.roomNumber}`}
										onClick={() => setToggle(false)}
										className={({ isActive }) =>
											`font-poppins text-base block w-full ${
												isActive
													? "text-white font-semibold"
													: "text-dimWhite hover:text-white"
											}`
										}>
										{room.name}
									</NavLink>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<main>
				<Outlet context={theHouse} />
			</main>
		</div>
	);
};
export default OneHousePage;
