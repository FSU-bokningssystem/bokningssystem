import type { RoomRowProps } from "../types/types";

const RoomRow = (props: RoomRowProps) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-semibold text-gray-900">
        {props.room.name}
      </td>
      <td className="px-6 py-4 text-gray-600">
        {props.room.roomNumber}
      </td>
      <td className="px-6 py-4 text-gray-600">
        {props.room.floor ?? "-"}
      </td>
      <td className="px-6 py-4 text-gray-500">
        {props.room.description}
      </td>
    </tr>
  );
};
export default RoomRow;