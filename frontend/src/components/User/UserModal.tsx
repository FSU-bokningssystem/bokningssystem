import { useState } from "react";
import { X, Mail, Phone, Globe, User, Edit } from "lucide-react";
import type { userData } from "../../types/types";
import EditUserModal from "./EditUserModal";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../../api/fetchData";
import type { Membership } from "../../types/types";

export interface UserModalProps {
  user: userData & { phoneNumber?: string };
  onClose: () => void;
  onUserUpdated?: () => void;
}

const UserModal = ({ user, onClose, onUserUpdated }: UserModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const displayPhone = user.phone || user.phoneNumber;
  console.log(user);
  const id = useAuth().currentUser?.id;

  const {
    data: userMemberships = [],
    isLoading,
    error,
  } = useQuery<Membership[]>({
    queryKey: ["membership", id],
    queryFn: () => fetchFromApi("membership/user/" + id),
    enabled: !!id,
  });

  const role = userMemberships[0]?.memberRole;
  const isOwner = role === "OWNER";

  console.log(userMemberships);
  console.log(isOwner);

  return (
    <>
      {!isEditing ? (
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
                <h3 className="text-lg font-bold text-gray-900">
                  Användardetaljer
                </h3>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
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
                <p className="text-xs font-semibold text-[#0058a3]">
                  ID: #{user.id}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{user.email}</span>
                </div>
                {displayPhone && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{displayPhone}</span>
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
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition cursor-pointer"
              >
                <Edit className="w-4 h-4" /> Redigera
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={console.log("hej")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-[#a30000] hover:bg-[#004f93] rounded-full transition cursor-pointer"
                >
                  <Edit className="w-4 h-4" /> Ta bort ur organisation
                </button>
              )}
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
      ) : (
        <EditUserModal
          user={user}
          onClose={onClose}
          onUserUpdated={onUserUpdated}
        />
      )}
    </>
  );
};

export default UserModal;
