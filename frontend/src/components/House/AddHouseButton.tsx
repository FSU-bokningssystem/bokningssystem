import { BuildingComplexPlus } from "lucide-react";
import { useState } from "react";
import AddHouseModal from "./AddHouseModal";
const AddHouseButton = () => {
	const [openModal, setOpenModal] = useState(false);

	const openForm = () => setOpenModal(true);
	const closeForm = () => setOpenModal(false);

	const handleSubmit = () => {
		setOpenModal(false);
		alert("Test");
	};

	return (
		<>
			<button
				className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0058a3] hover:bg-[#004f93] text-white text-sm font-bold rounded-full transition shadow-xs cursor-pointer"
				type="button"
				onClick={() => openForm()}>
				<BuildingComplexPlus className="w-3.5 h-3.5" />
				Lägg till hus
			</button>
			{openModal && (
				<AddHouseModal onClose={() => closeForm()} submitData={handleSubmit} />
			)}
		</>
	);
};
export default AddHouseButton;
