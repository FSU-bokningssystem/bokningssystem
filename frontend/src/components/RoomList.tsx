import RoomRow from "./RoomRow";

const Roomlist = () => {
  const Rooms = [
    { id: 0, name: "Room 101", floor: 1 },
    { id: 1, name: "Room 102", floor: 1 },
    { id: 2, name: "Room 103", floor: 1 },
    { id: 3, name: "Room 104", floor: 1 },
    { id: 4, name: "Room 105", floor: 1 },
  ];

  return (
    <div className="overflow-x-auto p-4 w-full">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Användarnamn
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left bg-black">
              Namn
            </th>
          </tr>
        </thead>
        <tbody>
          {Rooms.map((room) => (
            <RoomRow
              key={room.id}
              name={room.name}
              floor={room.floor}
            ></RoomRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Roomlist;
