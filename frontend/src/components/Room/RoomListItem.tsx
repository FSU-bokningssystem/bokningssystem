import { NavLink } from "react-router-dom";
import type { roomData } from "../../types/types";

const RoomListItem = ({
	houseId,
	room,
}: {
	houseId: number;
	room: roomData;
}) => {
	return (
		<li>
			<NavLink
				to={`/houses/${houseId}/${room.roomNumber}`}
				className={({ isActive }) =>
					(isActive ? "font-bold bg-indigo-700 " : "bg-indigo-500") +
					"font-sans text-white border-yellow-50 border-2 rounded-2xl p-2 hover:bg-teal-500 hover:text-black transition-colors duration-300 block"
				}>
				{room.name}
			</NavLink>
		</li>
	);
};
export default RoomListItem;
