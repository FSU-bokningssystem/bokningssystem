import { NavLink } from "react-router-dom";
import type { roomData } from "../../types/types";
import { DoorOpen } from "lucide-react";

const RoomListItem = ({
  houseId,
  room,
}: {
  houseId: number;
  room: roomData;
}) => {
  return (
    <li>
      <NavLink
        to={`/houses/${houseId}/${room.roomNumber}`}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 font-medium text-sm ${
            isActive
              ? "bg-[#0058a3] text-white shadow-xs font-semibold"
              : "text-gray-700 bg-white hover:bg-gray-100 border border-gray-200"
          }`
        }
      >
        <DoorOpen className="w-4 h-4 shrink-0" />
        <span className="truncate">{room.name}</span>
      </NavLink>
    </li>
  );
};
export default RoomListItem;