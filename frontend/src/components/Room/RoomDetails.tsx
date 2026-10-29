import { useOutletContext, useParams, Navigate } from "react-router-dom";
import type { houseWithRoomsData } from "../../types/types";

const RoomDetails = () => {
	const theHouse: houseWithRoomsData = useOutletContext();
	const rooms = theHouse.rooms;
	const { houseid, roomNbr } = useParams<{
		houseid: string;
		roomNbr: string;
	}>();
	const room = rooms.find((r) => r.roomNumber === roomNbr);
	if (!room) return <Navigate to={`/houses/${theHouse.id}`} replace />;

	return (
		<>
			<h3 className="font-sans text-xl text-white font-bold">{room.name}</h3>
			<p className="font-sans text-white">
				Rumsnummer {room.roomNumber} i {room.houseName} på våning {room.floor}.
			</p>
			<p className="font-sans text-white">{room.description}</p>
			<p></p>
			<p className="font-sans text-white">
				Rummet är{" "}
				{room.isAvailable ? <>bokningsbart</> : <>inte bokningsbart</>}.
			</p>
		</>
	);
};
export default RoomDetails;
