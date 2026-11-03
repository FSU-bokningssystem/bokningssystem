import { useOutletContext } from "react-router-dom";
import type { houseWithRoomsData } from "../../types/types";
import { MapPin, Globe, Building } from "lucide-react";

const HouseDetails = () => {
  const theHouse: houseWithRoomsData = useOutletContext();
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{theHouse.name}</h3>
      <div className="flex items-center gap-2 text-sm text-[#0058a3] font-semibold mb-6">
        <Building className="w-4 h-4" />
        <span>Tillhör {theHouse.organizationName}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Adress</p>
            <p className="text-sm font-medium text-gray-900">{theHouse.street} {theHouse.streetNumber}</p>
            <p className="text-sm text-gray-600">{theHouse.zipCode} {theHouse.city}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tidszon</p>
            <p className="text-sm font-medium text-gray-900">{theHouse.timeZone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HouseDetails;