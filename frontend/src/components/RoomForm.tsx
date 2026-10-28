import { useState } from "react";
import RoomModal from "./RoomModal";
import { postToApi } from "../api/postData";

const RoomForm = () => {
  const [openModal, setOpenModal] = useState(false);

  const openForm = () => {
    setOpenModal(true);
  };
  const closeForm = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (values) => {
    console.log(values);
    await postToApi("room", values);
    ///closeForm();
  };

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={openForm}
      >
        Lägg till Lokal
      </button>
      {openModal && <RoomModal onClose={closeForm} submitData={handleSubmit} />}
    </>
  );
};
export default RoomForm;
