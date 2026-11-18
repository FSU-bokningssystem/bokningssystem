import { X, Trash } from "lucide-react";
import type { BookingEditModalProps } from "../../types/types";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFromApi } from "../../api/deleteData";
import { useState } from "react";

const DeleteBookingModal = ({ booking, onClose }: BookingEditModalProps) => {
	const auth = useAuth();

	const queryClient = useQueryClient();
	const [showAsk, setShowAsk] = useState(true);

	const closeModal = () => {
		if (removeMutation.isPending) return;
		onClose();
	};

	const removeMutation = useMutation({
		mutationFn: () => deleteFromApi(`booking/${booking.id}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bookinglist"] });
			auth.removeBooking(booking);
		},
	});

	const submitDelete = () => {
		setShowAsk(false);
		removeMutation.mutate();
	};

	const modalMessage = () => {
		if (removeMutation.isPending) return <div>Bokningen tas bort...</div>;
		if (removeMutation.isError) return <div>Något gick fel</div>;
		if (removeMutation.isSuccess)
			return (
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
			);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
			onClick={closeModal}>
			<div
				className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-100 pb-4">
					<h3 className="text-lg font-bold text-gray-900">Ta bort bokning</h3>
					<button
						onClick={closeModal}
						type="button"
						className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
						<X className="h-5 w-5" />
						<span className="sr-only">Stäng</span>
					</button>
				</div>
				<div>
					{showAsk && (
						<>
							<div>Vill du verkligen ta bort bokningen?</div>
							<div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
								<button
									onClick={closeModal}
									type="button"
									className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-800 rounded-full transition">
									Behåll
								</button>
								<button
									onClick={submitDelete}
									type="button"
									className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-800 rounded-full transition shadow-xs">
									<Trash className="h-4 w-4" />
									Radera
								</button>
							</div>
						</>
					)}
					{modalMessage()}
				</div>
			</div>
		</div>
	);
};
export default DeleteBookingModal;
