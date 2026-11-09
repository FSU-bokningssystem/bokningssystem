import RoomRow from "./RoomRow";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import type { houseWithRoomsData, RoomListProps } from "../types/types";

const Roomlist = (props: RoomListProps) => {
  const {
    data: theHouse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["house", props.id],
    queryFn: () => fetchFromApi<houseWithRoomsData>("house/" + props.id),
  });

  if (isLoading) return <p className="text-gray-500">Laddar lokaler...</p>;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3.5">Rumsnamn</th>
              <th className="px-6 py-3.5">Rumsnummer</th>
              <th className="px-6 py-3.5">Våning</th>
              <th className="px-6 py-3.5">Beskrivning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {theHouse?.rooms?.map((room) => (
              <RoomRow key={room.id} room={room} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Roomlist;