import { X, Plus } from "lucide-react";
import { useState } from "react";
import type {
	BookingData,
	BookingEditData,
	BookingModalProps,
} from "../../types/types";
import type React from "react";
import { useAuth } from "../../context/AuthContext";

const EditBookingModal = (
	booking: BookingData,
	{ onClose, submitData }: BookingModalProps,
) => {
	const auth = useAuth();
	let houseIdNbr = Number(booking.houseId);

	const dateToString = (date: Date) => {
		const pad = (num: number) => num.toString().padStart(2, "0");
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
			date.getDate(),
		)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
	};

	const minDateTime = () => {
		const now = new Date();
		now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
		return dateToString(now);
	};

	const [startTime, setStartTime] = useState(minDateTime());
	const [endTime, setEndTime] = useState("");
	const [newTitle, setNewTitle] = useState(null);
	const [newDescription, setNewDescription] = useState(null);
	const [newHouseId, setNewHouseId] = useState(null);
	const [newRoomNumber, setNewRoomNumber] = useState(null);
	const [newOwnerId, setNewOwnerId] = useState(null);

	const handleStartTimeChange = (value: string) => {
		setStartTime(value);
		if (!endTime || value >= endTime) {
			setEndTime(value);
		}
	};

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const values: BookingEditData = {
			bookingId: booking.id,
			houseId: formData.get("house") ? Number(formData.get("house")) : null,
			roomNumber: formData.get("roomNumber")
				? (formData.get("roomNumber") as string)
				: null,
			title: formData.get("title") ? (formData.get("title") as string) : null,
			description: formData.get("description")
				? (formData.get("description") as string)
				: null,
			startTime: formData.get("startTime")
				? (formData.get("startTime") as string)
				: null,
			endTime: formData.get("endTime")
				? (formData.get("endTime") as string)
				: null,
			ownerId: null,
		};

		if (values.startTime >= values.endTime) {
			alert("Sluttiden måste vara efter starttiden.");
			return;
		}
		if (values.startTime < minDateTime()) {
			alert("Starttiden måste vara i framtiden.");
			return;
		}
		if (values.title.length < 4 || values.title.length > 45) {
			alert("Titeln måste vara mellan 4 och 45 tecken.");
			return;
		}
		if (values.description.length === 0) {
			values.description = "Du måste fylla i en beskrivning.";
		}
		submitData(values);
	};

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

				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					<div>
						<label
							htmlFor="titel"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Titel
						</label>
						<input
							type="text"
							name="title"
							id="title"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							placeholder={booking.title}
							minLength={4}
							maxLength={45}
							size={45}
						/>
					</div>
					<div>
						<label
							htmlFor="house"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Hus
						</label>
						<select
							id="house"
							name="house"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							onChange={(e) => {
								houseIdNbr = Number(e.target.value);
							}}>
							<option value="">{booking.houseName}</option>
							{auth.activeOrganization?.houses.map((house) => (
								<option key={house.id} value={house.id}>
									{house.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label
							htmlFor="roomNumber"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Rum
						</label>
						<select
							id="roomNumber"
							name="roomNumber"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]">
							<option value="">{booking.roomNumber}</option>
							{auth.activeOrganization?.houses
								.find((h) => h.id === houseIdNbr)
								?.rooms.map((room) => (
									<option key={room.id} value={room.roomNumber}>
										{room.name}
									</option>
								))}
						</select>
					</div>
					<div>
						<label
							htmlFor="description"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Beskrivning
						</label>
						<textarea
							name="description"
							id="description"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							placeholder={booking.description}
							rows={4}
							cols={80}
							onChange={(e) => {
								values.description = e.target.value;
							}}
						/>
					</div>

					<div>
						<label
							htmlFor="startTime"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Starttid
						</label>
						<input
							type="datetime-local"
							name="startTime"
							id="startTime"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							required
							value={startTime}
							min={minDateTime()}
							step={300}
							onChange={(e) => handleStartTimeChange(e.target.value)}
						/>
					</div>
					<div>
						<label
							htmlFor="endTime"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Sluttid
						</label>
						<input
							type="datetime-local"
							name="endTime"
							id="endTime"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							required
							value={endTime}
							min={minDateTime()}
							step={300}
							onChange={(e) => setEndTime(e.target.value)}
						/>
					</div>
					<div>
						<label
							htmlFor="ownerId"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Ägare
						</label>

						<select
							name="ownerId"
							id="ownerId"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]">
							<option value="">
								{booking.owner.firstName} {booking.owner.lastName}
							</option>
							{houses.map((house) => (
								<option key={house.id} value={house.ownerId}>
									{house.ownerName}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
						<button
							onClick={onClose}
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition">
							Avbryt
						</button>
						<button
							type="submit"
							className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition shadow-xs">
							<Plus className="h-4 w-4" />
							Boka
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default EditBookingModal;
