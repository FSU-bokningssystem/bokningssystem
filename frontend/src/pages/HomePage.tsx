import { Building2, Users, DoorOpen } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="space-y-8">
      <div className="bg-[#0058a3] text-white p-8 sm:p-12 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="bg-[#ffdb00] text-[#111111] text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
            Välkommen
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Hantera lokaler och hus enkelt
          </h1>
          <p className="text-blue-100 text-base sm:text-lg">
            En modern och avskalad plattform för administration av rum, användare och byggnader.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/houses" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0058a3] shadow-xs hover:shadow-md transition group">
          <Building2 className="w-8 h-8 text-[#0058a3] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Hus & Byggnader</h3>
          <p className="text-sm text-gray-500">Översikt över alla dina registrerade hus och rum.</p>
        </Link>
        <Link to="/rooms" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0058a3] shadow-xs hover:shadow-md transition group">
          <DoorOpen className="w-8 h-8 text-[#0058a3] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Lokaler</h3>
          <p className="text-sm text-gray-500">Skapa nya rum och administrera tillgänglighet.</p>
        </Link>
        <Link to="/users" className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0058a3] shadow-xs hover:shadow-md transition group">
          <Users className="w-8 h-8 text-[#0058a3] mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Användare</h3>
          <p className="text-sm text-gray-500">Se alla användare och byt konto snabbt och smidigt.</p>
        </Link>
      </div>
    </div>
  );
};
export default HomePage;