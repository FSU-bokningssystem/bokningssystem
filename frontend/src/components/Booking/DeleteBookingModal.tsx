import { X, SquarePen, Trash } from "lucide-react";
import type { BookingEditModalProps } from "../../types/types";
import type React from "react";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { putToApi } from "../../api/putData";
import { useState } from "react";

const DeleteBookingModal = ({ booking, onClose }: BookingEditModalProps) => {
	const auth = useAuth();
	const queryClient = useQueryClient();
	const [status, setStatus] = useState("asking");

	const onSubmit = () => {
		setStatus("deleting");
		setTimeout(onDeleted, 3000);
	};

	const onDeleted = () => {
		setStatus("finished");
	};

	/* 	const submitDeleteData = async (values: BookingEditData) => {
		try {
			const newBooking = await putToApi("booking", values);
			await queryClient.invalidateQueries({ queryKey: ["bookinglist"] });
			auth.updateBooking(newBooking);

			onClose();
			alert("Bokningen har uppdaterats!");
		} catch (error: any) {
			alert(error.message || "Ett fel uppstod vid uppdatering av bokningen.");
		}
	}; */

	/* const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const values: BookingEditData = {
			id: booking.id,
			houseId:
				formData.get("house") === "" ? null : Number(formData.get("house")),
			roomNumber:
				formData.get("roomNumber") === ""
					? null
					: (formData.get("roomNumber") as string),
			title:
				formData.get("title") === booking.title
					? null
					: (formData.get("title") as string),
			description:
				formData.get("description") === booking.description
					? null
					: (formData.get("description") as string),
			startTime:
				formData.get("startTime") === booking.startTime.slice(0, 16)
					? null
					: (formData.get("startTime") as string),
			endTime:
				formData.get("endTime") === booking.endTime.slice(0, 16)
					? null
					: (formData.get("endTime") as string),
			ownerId:
				formData.get("ownerId") === "" ? null : Number(formData.get("ownerId")),
		};
		if (
			values.startTime &&
			values.endTime &&
			values.startTime >= values.endTime
		) {
			alert("Sluttiden måste vara efter starttiden.");
			return;
		}
		if (values.startTime && values.startTime < minDateTime()) {
			alert("Starttiden måste vara i framtiden.");
			return;
		}
		if (
			values.houseId != null &&
			!auth.activeOrganization?.houses
				.find((h) => h.id === values.houseId)
				?.rooms.some((r) => r.roomNumber === values.roomNumber)
		) {
			alert("Det valda rummet finns inte i det valda huset.");
			return;
		}

		submitEditData(values);
	}; */

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
			onClick={onClose}>
			<div
				className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-100 pb-4">
					<h3 className="text-lg font-bold text-gray-900">Boka rum</h3>
					<button
						onClick={onClose}
						type="button"
						className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
						<X className="h-5 w-5" />
						<span className="sr-only">Stäng</span>
					</button>
				</div>
				<div>
					{status === "asking" && (
						<>
							<div>Vill du verkligen ta bort bokningen?</div>
							<div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
								<button
									onClick={onClose}
									type="button"
									className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-800 rounded-full transition">
									Behåll
								</button>
								<button
									onClick={onSubmit}
									className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-800 rounded-full transition shadow-xs">
									<Trash className="h-4 w-4" />
									Radera
								</button>
							</div>
						</>
					)}
					{status === "deleting" && (
						<>
							<div>Bokningen tas bort...</div>
						</>
					)}
					{status === "finished" && (
						<>
							<div>Bokningen borttagen!</div>
							<div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
								<button
									onClick={onClose}
									type="button"
									className="px-4 py-2 text-sm font-medium text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition">
									OK
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
export default DeleteBookingModal;
