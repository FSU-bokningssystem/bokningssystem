import { BuildingComplexPlus } from "lucide-react";
import { useState } from "react";
const AddHouseButton = () => {
	const [openModal, setOpenModal] = useState(false);
	const auth = useAuth();

	const openForm = () => setOpenModal(true);
	const closeForm = () => setOpenModal(false);

	return (
		<button className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0058a3] hover:bg-[#004f93] text-white text-sm font-bold rounded-full transition shadow-xs cursor-pointer">
			<BuildingComplexPlus className="w-3.5 h-3.5" />
			Lägg till hus
		</button>
	);
};
export default AddHouseButton;
