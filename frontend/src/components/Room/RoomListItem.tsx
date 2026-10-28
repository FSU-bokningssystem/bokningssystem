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
			<NavLink to={`/houses/${houseId}/${room.id}`}>{room.name}</NavLink>
		</li>
	);
};
export default RoomListItem;
