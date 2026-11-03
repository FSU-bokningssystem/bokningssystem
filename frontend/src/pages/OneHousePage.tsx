import { fetchFromApi } from "../api/fetchData";
import { postToApi } from "../api/postData";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Outlet, useParams, Link, useNavigate } from "react-router-dom";
import RoomListItem from "../components/Room/RoomListItem";
import RoomModal from "../components/RoomModal";
import type { houseWithRoomsData, roomCreateData } from "../types/types";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useState } from "react";
import { DoorClosed, ChevronLeft, Building, ArrowLeft, Plus } from "lucide-react";

const OneHousePage = () => {
  const [toggle, setToggle] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const { houseid } = useParams<{ houseid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const houseIdNbr = houseid ? parseInt(houseid) : null;

  const {
    data: theHouse,
    isLoading,
    error,
  } = useQuery<houseWithRoomsData>({
    queryKey: ["house", houseIdNbr],
    queryFn: () => fetchFromApi("house/" + houseIdNbr),
  });

  // Mutation för att skicka nytt rum till API
  const addRoomMutation = useMutation({
    mutationFn: (values: roomCreateData) => postToApi("room", values),
    onSuccess: () => {
      // Invalidera cachen för detta hus så att den nya lokalen syns direkt i listan
      queryClient.invalidateQueries({ queryKey: ["house", houseIdNbr] });
      setOpenModal(false);
    },
  });

  // Hanterar submit från RoomModal och skickar med valt hus-ID automatisk
  const handleSubmitRoom = (values: roomCreateData) => {
    if (!houseIdNbr) return;

    addRoomMutation.mutate({
      ...values,
      houseId: houseIdNbr, // Här skickas automatiskt det valda husets ID med!
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;
  if (!theHouse || houseIdNbr === null)
    return (
      <p className="text-gray-600">
        Inget hus valt, vänligen gå tillbaka till Hus och välj ett hus från listan.
      </p>
    );

  return (
    <div className="space-y-6">
      {/* Översta navigeringsfältet med tillbaka-knapp och Lägg till lokal */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/houses")}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tillbaka till hus</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0058a3] hover:bg-[#004f93] text-white text-sm font-bold rounded-full transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Lägg till lokal</span>
        </button>
      </div>

      {/* Mobilknapp för sidomeny */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setToggle((prev) => !prev)}
          className="flex items-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl font-medium text-sm text-gray-700 shadow-xs"
        >
          {toggle ? <ChevronLeft className="w-5 h-5" /> : <DoorClosed className="w-5 h-5 text-[#0058a3]" />}
          <span>{toggle ? "Dölj rum" : "Visa alla rum"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Vänstermeny / Rumspanel */}
        <aside
          className={`${
            toggle ? "block" : "hidden md:block"
          } bg-white p-4 rounded-xl border border-gray-200 shadow-xs md:col-span-1 space-y-3`}
        >
          <Link
            to={`/houses/${houseIdNbr}`}
            className="flex items-center gap-2 p-2.5 font-bold text-gray-900 hover:text-[#0058a3] transition border-b border-gray-100"
          >
            <Building className="w-4 h-4 text-[#0058a3]" />
            <span>Översikt</span>
          </Link>

          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 block mb-2">
              Rum ({theHouse.rooms.length})
            </span>
            <ul className="space-y-1.5">
              {theHouse.rooms.map((room) => (
                <RoomListItem key={room.id} houseId={houseIdNbr} room={room} />
              ))}
            </ul>
          </div>
        </aside>

        {/* Huvudinnehåll */}
        <main className="md:col-span-3">
          <Outlet context={theHouse} />
        </main>
      </div>
      
      {openModal && (
        <RoomModal
          onClose={() => setOpenModal(false)}
          submitData={handleSubmitRoom}
        />
      )}
    </div>
  );
};

export default OneHousePage;