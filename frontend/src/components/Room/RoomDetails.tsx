import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOutletContext, useParams, Navigate } from "react-router-dom";
import type { houseWithRoomsData, BookingCreateData } from "../../types/types";
import { CalendarArrowRight, XCircle, Info, Layers } from "lucide-react";
import { postToApi } from "../../api/postData";
import BookingModal from "./BookingModal";
import RoomBookingDetails from "./RoomBookingDetails";

const RoomDetails = () => {
	const [openModal, setOpenModal] = useState(false);
	const queryClient = useQueryClient();

	const openForm = () => setOpenModal(true);
	const closeForm = () => setOpenModal(false);

	const handleSubmit = async (values: BookingCreateData) => {
		try {
			await postToApi("booking", values);
			await queryClient.invalidateQueries({ queryKey: ["bookinglist"] });
			closeForm();
			alert("Bokningen har skapats!");
		} catch (error: any) {
			alert(error.message || "Ett fel uppstod vid skapandet av bokningen.");
		}
	};

	const theHouse: houseWithRoomsData = useOutletContext();
	const rooms = theHouse.rooms;
	const { roomNbr } = useParams<{
		houseid: string;
		roomNbr: string;
	}>();

	const room = rooms.find((r) => r.roomNumber === roomNbr);
	if (!room) return <Navigate to={`/houses/${theHouse.id}`} replace />;

	return (
		<>
		<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-6">
			<div className="flex justify-between items-start flex-wrap gap-4">
				<div>
					<span className="text-xs font-bold text-[#0058a3] uppercase tracking-wider">
						Rum {room.roomNumber}
					</span>
					<h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
				</div>
				<span
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
						room.isAvailable
							? "bg-green-100 text-green-800 border border-green-200"
							: "bg-red-100 text-red-800 border border-red-200"
					}`}>
					{room.isAvailable ? (
						<>
							<button
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-800 text-white font-bold py-2.5 px-5 rounded-full transition shadow-xs text-sm"
								onClick={openForm}>
								<CalendarArrowRight className="w-3.5 h-3.5" />
								Boka rum
							</button>
							{openModal && (
								<BookingModal onClose={closeForm} submitData={handleSubmit} />
							)}
						</>
					) : (
						<>
							<XCircle className="w-3.5 h-3.5" /> Inte bokningsbart
						</>
					)}
				</span>
			</div>

			<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
				<Layers className="w-4 h-4 text-gray-400" />
				<span>
					Våning {room.floor} i {room.houseName}
				</span>
			</div>

			{room.description && (
				<div className="space-y-1">
					<div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
						<Info className="w-3.5 h-3.5" /> Beskrivning
					</div>
					<p className="text-sm text-gray-700 leading-relaxed bg-white">
						{room.description}
					</p>
				</div>
			)}
		</div>
		<RoomBookingDetails roomId={room.id} />
		</>
	);
};
export default RoomDetails;
