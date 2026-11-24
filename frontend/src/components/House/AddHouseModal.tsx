const AddHouseModal = ({ onClose, submitData, error }: HouseModalProps) => {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
			onClick={onClose}>
			<div
				className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-100 pb-4">
					<h3 className="text-lg font-bold text-gray-900">
						{isEditing ? "Redigera lokal" : "Lägg till lokal"}
					</h3>
					<button
						onClick={onClose}
						type="button"
						className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
						<X className="h-5 w-5" />
						<span className="sr-only">Stäng</span>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					Empty form
				</form>
			</div>
		</div>
	);
};
export default AddHouseModal;
