import { useState } from "react";
import RoomModal from "./RoomModal";
import { postToApi } from "../api/postData";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import Roomlist from "./RoomList";
import type { houseWithRoomsData, roomCreateData } from "../types/types";
const RoomForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState("1");

  const openForm = () => {
    setOpenModal(true);
  };
  const closeForm = () => {
    setOpenModal(false);
  };
  const {
    data: houselist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["houses"],
    queryFn: () => fetchFromApi("house"),
  });
  if (isLoading) return <p>Laddar hus...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;

  console.log(selectedHouse);
  ///Använd valt hus för att lägga till en ny lokal
  const handleSubmit = async (values: roomCreateData) => {
    console.log(values);
    await postToApi("room", { ...values, houseId: Number(selectedHouse) });
    closeForm();
  };

  return (
    <>
      <div className="flex justify-between items-end w-full">
        <form className="w-full max-w-sm">
          <label className="block mb-2.5 text-sm font-medium text-heading">
            Välj Hus
          </label>
          <select
            value={selectedHouse}
            onChange={(e) => setSelectedHouse(e.target.value)}
            className="w-full px-3 py-2.5 bg-primary border border-gray-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary shadow-xs"
          >
            <option value="" disabled className="bg-primary text-white">
              -- Välj ett hus --
            </option>
            {houselist.map((house: houseWithRoomsData) => (
              <option
                key={house.id}
                value={house.id}
                className="bg-primary text-white"
              >
                {house.name}
              </option>
            ))}
          </select>
        </form>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={openForm}
        >
          Lägg till Lokal
        </button>
        {openModal && (
          <RoomModal onClose={closeForm} submitData={handleSubmit} />
        )}
      </div>
      <Roomlist id={Number(selectedHouse)}></Roomlist>
    </>
  );
};
export default RoomForm;
