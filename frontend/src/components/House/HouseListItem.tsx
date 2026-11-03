import type { houseData } from "../../types/types";
import { NavLink } from "react-router-dom";
import { Building2, MapPin } from "lucide-react";

const HouseListItem = ({ house }: { house: houseData }) => {
  return (
    <NavLink
      to={`/houses/${house.id}`}
      className="block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0058a3] shadow-xs hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="p-2 bg-blue-50 text-[#0058a3] rounded-lg group-hover:bg-[#0058a3] group-hover:text-white transition-colors">
          <Building2 className="w-5 h-5" />
        </span>
        <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          ID: {house.id}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0058a3] transition-colors mb-1">
        {house.name}
      </h3>
      <p className="text-sm font-medium text-gray-500 mb-3">
        {house.organizationName}
      </p>
      <div className="flex items-center text-xs text-gray-500 gap-1 border-t border-gray-100 pt-3">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <span>{house.city}</span>
      </div>
    </NavLink>
  );
};
export default HouseListItem;