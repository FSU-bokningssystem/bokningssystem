import { useState } from "react";
import RoomModal from "./RoomModal";
import { postToApi } from "../api/postData";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import Roomlist from "./RoomList";
import type { houseWithRoomsData, roomCreateData } from "../types/types";
import { Plus, Home } from "lucide-react";

const RoomForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("1");

  const openForm = () => setOpenModal(true);
  const closeForm = () => setOpenModal(false);

  const {
    data: houselist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: () => fetchFromApi("house"),
  });

  if (isLoading) return <p className="text-gray-500">Laddar hus...</p>;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

  const handleSubmit = async (values: roomCreateData) => {
    await postToApi("room", { ...values, houseId: Number(selectedHouse) });
    closeForm();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-end justify-between gap-4">
        <form className="w-full sm:max-w-xs space-y-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
            Välj Hus
          </label>
          <div className="relative">
            <select
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#0058a3] focus:border-[#0058a3] transition"
            >
              <option value="" disabled>
                -- Välj ett hus --
              </option>
              {houselist?.map((house: houseWithRoomsData) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>
        </form>
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0058a3] hover:bg-[#004f93] text-white font-bold py-2.5 px-5 rounded-full transition shadow-xs text-sm"
          onClick={openForm}
        >
          <Plus className="w-4 h-4" /> Lägg till Lokal
        </button>

        {openModal && (
          <RoomModal onClose={closeForm} submitData={handleSubmit} />
        )}
      </div>

      <Roomlist id={Number(selectedHouse)} />
    </div>
  );
};
export default RoomForm;