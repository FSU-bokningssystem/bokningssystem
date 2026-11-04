import { X, Plus } from "lucide-react";
import { useState } from "react";
import type { BookingCreateData, BookingModalProps } from "../../types/types";
import type React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BookingModal = ({ onClose, submitData }: BookingModalProps) => {
	const auth = useAuth();
	const { houseid, roomNbr } = useParams<{
		houseid: string;
		roomNbr: string;
	}>();
	const houseIdNbr = Number(houseid);
	const roomNumber = roomNbr || "";

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

	const handleStartTimeChange = (value: string) => {
		setStartTime(value);
		if (!endTime || value >= endTime) {
			setEndTime(value);
		}
	};

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		if (!auth.currentUser) {
			alert("Du måste vara inloggad för att boka ett rum.");
			return;
		}
		const values: BookingCreateData = {
			houseId: houseIdNbr,
			roomNumber: roomNumber,
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			startTime: formData.get("startTime") as string,
			endTime: formData.get("endTime") as string,
			ownerId: auth.currentUser.id,
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
							placeholder="T ex Möte med kund"
							minLength={4}
							maxLength={45}
							size={45}
							required
						/>
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
							placeholder="(valfritt)"
							rows={4}
							cols={80}
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
export default BookingModal;
