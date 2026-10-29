import RoomRow from "./RoomRow";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import type { roomData, RoomListProps } from "../types/types";

const Roomlist = (props: RoomListProps) => {
  const {
    data: theHouse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["house", props.id],
    queryFn: () => fetchFromApi("house/" + props.id),
  });
  if (isLoading) return <p>Laddar hus...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  console.log(theHouse);
  return (
    <div className="overflow-x-auto pt-10 w-full">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Rumsnamn
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Rumsnummer
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Våning
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Beskrivning
            </th>
          </tr>
        </thead>
        <tbody>
          {theHouse.rooms.map((room: roomData) => (
            <RoomRow key={room.id} room={room}></RoomRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Roomlist;
