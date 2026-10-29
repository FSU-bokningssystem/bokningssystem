import type { RoomRowProps } from "../types/types";

const RoomRow = (props: RoomRowProps) => {
  return (
    <tr className="hover:bg-gray-500">
      <td className="border border-gray-300 px-4 py-2 align-top">
        <p>{props.room.name}</p>
      </td>
      <td className="border border-gray-300 px-4 py-2 align-top">
        {props.room.roomNumber}
      </td>
      <td className="border border-gray-300 px-4 py-2 align-top">
        {props.room.floor}
      </td>
      <td className="border border-gray-300 px-4 py-2 align-top">
        {props.room.description}
      </td>
    </tr>
  );
};
export default RoomRow;
