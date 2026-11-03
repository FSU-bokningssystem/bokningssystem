import { X, Mail, Phone, Globe, User } from "lucide-react";
import type { userData } from "../../types/types";

// Explicit interface som tillåter både user och onClose som props
export interface UserModalProps {
  user: userData;
  onClose: () => void;
}

const UserModal = ({ user, onClose }: UserModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#0058a3] rounded-full">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Användardetaljer</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Stäng</span>
          </button>
        </div>

        {/* Innehåll */}
        <div className="py-6 space-y-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h4>
            <p className="text-xs font-semibold text-[#0058a3]">ID: #{user.id}</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.timeZone && (
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                <span>{user.timeZone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;