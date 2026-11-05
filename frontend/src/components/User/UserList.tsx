import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserListItem from "./UserListItem";
import UserModal from "./UserModal";
import AddUserModal from "./AddUserModal";
import type { userData } from "../../types/types";
import { UserCheck, LogIn, UserPlus, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const UserList = ({ users }: { users: userData[] }) => {
  const { loginAs, currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<userData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleUserCreated = () => {
    // Uppdatera användarlistan i cachen när en ny användare skapas
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <div className="space-y-4">
      {/* Header med Skapa Användare-knappen */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <span className="text-sm font-bold text-gray-700">
          Totalt antal användare: {users.length}
        </span>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#0058a3] hover:bg-[#004f93] text-white font-bold py-2.5 px-5 rounded-full transition shadow-xs text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Skapa användare
        </button>
      </div>

      {/* Användarlista */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => {
            const isCurrent = currentUser?.id === user.id;
            return (
              <li
                key={user.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition-colors gap-4"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => setSelectedUser(user)}
                >
                  <UserListItem user={user} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                  >
                    <Info className="w-3.5 h-3.5" /> Detaljer
                  </button>
                  <button
                    onClick={() => loginAs(user.id)}
                    disabled={isCurrent}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${
                      isCurrent
                        ? "bg-green-100 text-green-700 border border-green-300 cursor-default"
                        : "bg-[#0058a3] hover:bg-[#004f93] text-white"
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" /> Inloggad
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3.5 h-3.5" /> Logga in som
                      </>
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detaljmodal för vald användare */}
      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Modal för att skapa ny användare */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default UserList;