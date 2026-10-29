import { useOutletContext, useParams, Navigate } from "react-router-dom";
import type { houseWithRoomsData } from "../../types/types";

const RoomDetails = () => {
	const theHouse: houseWithRoomsData = useOutletContext();
	const rooms = theHouse.rooms;
	const { houseid, roomid } = useParams<{ houseid: string; roomid: string }>();
	const roomIdNbr = roomid ? parseInt(roomid) : null;
	const room = rooms.find((r) => r.id === roomIdNbr);
	if (!room) return <Navigate to={`/house/${theHouse.id}`} replace />;

	return (
		<>
			<h3>{room.name}</h3>
			<p>
				Rumsnummer {room.roomNumber} i {room.houseName} på våning {room.floor}.
			</p>
			<p>{room.description}</p>
			<p></p>
			<p>
				Rummet är{" "}
				{room.isAvailable ? <>bokningsbart</> : <>inte bokningsbart</>}.
			</p>
		</>
	);
};
export default RoomDetails;
