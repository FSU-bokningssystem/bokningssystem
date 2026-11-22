import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import UserListItem from "./UserListItem";
import UserModal from "./UserModal";
import AddUserModal from "./AddUserModal";
import AddUserToOrgModal from "../AddUserToOrgModal";
import type { userData } from "../../types/types";
import { UserPlus, Info, Crown, Trash2, ArrowRightLeft, X } from "lucide-react";
import { fetchFromApi } from "../../api/fetchData";
import { putToApi } from "../../api/putData";
import { deleteFromApi } from "../../api/deleteData";

interface OrgMemberResponse {
  userId?: number;
  id?: number;
  memberRole?: string;
  member_role?: string;
  role?: string;
}

interface OrgMemberWithUser {
  user: userData;
  role: string;
}

const UserList = () => {
  const { currentUser, activeOrganization } = useAuth();
  const [selectedUser, setSelectedUser] = useState<userData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddToOrgModalOpen, setIsAddToOrgModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [members, setMembers] = useState<OrgMemberWithUser[]>([]);

  const loadUsers = async () => {
    if (!activeOrganization) return;

    try {
      const memberships = await fetchFromApi<OrgMemberResponse[]>(
        `membership/organization/${activeOrganization.id}`
      );

      const validMembers = memberships.filter(
        (m): m is OrgMemberResponse & { userId?: number; id?: number } =>
          (m.userId ?? m.id) !== undefined
      );

      const fullMembersData = await Promise.all(
        validMembers.map(async (m) => {
          const id = (m.userId ?? m.id)!;
          const user = await fetchFromApi<userData>(`user/${id}`);
          return {
            user,
            role: m.role ?? m.memberRole ?? m.member_role ?? "MEMBER",
          };
        })
      );

      // OWNER alltid högst upp
      const sortedMembers = fullMembersData.sort((a, b) => {
        if (a.role === "OWNER") return -1;
        if (b.role === "OWNER") return 1;
        return 0;
      });

      setMembers(sortedMembers);
    } catch (err) {
      console.error("Fel vid hämtning av användare:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeOrganization]);

  const currentMember = members.find((m) => m.user.id === currentUser?.id);
  const canManageOrg =
    currentMember?.role === "OWNER" || currentMember?.role === "ADMIN";

  const handleRemoveMember = async (targetUserId: number) => {
    if (!activeOrganization || !currentUser) return;
    if (!window.confirm("Är du säker på att du vill ta bort medlemmen?")) return;

   try {
      await deleteFromApi(
        `membership/organization/${activeOrganization.id}/user/${targetUserId}`
      );

      loadUsers();
    } catch (err: any) {
      alert(err.message || "Kunde inte ta bort medlemmen.");
    }
  };

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    if (!activeOrganization || !currentUser || !newOwnerId) return;

    setTransferLoading(true);
    try {
    await putToApi("membership/organization/transferOwner", {
  userId: Number(newOwnerId),
  organizationId: activeOrganization.id,
  role: "OWNER",
});
      setIsTransferModalOpen(false);
      setNewOwnerId("");
      loadUsers();
    } catch (err: any) {
      setTransferError(
        err.message || "Kunde inte lämna över organisationen."
      );
    } finally {
      setTransferLoading(false);
    }
  };

  const nonOwnerMembers = members.filter((m) => m.role !== "OWNER");

  return (
    <div className="space-y-4">
      {/* Header med knappar för OWNER och ADMIN */}
      <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-xs gap-3">
        <span className="text-sm font-bold text-gray-700">
          Totalt antal medlemmar: {members.length}
        </span>

        {canManageOrg && (
          <div className="flex flex-wrap items-center gap-2">
            {nonOwnerMembers.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setTransferError(null);
                  setIsTransferModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-2.5 px-4 rounded-full transition text-sm cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Lämna över organisation
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddToOrgModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-5 rounded-full transition text-sm cursor-pointer"
            >
              Lägg till medlemmar
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#0058a3] hover:bg-[#004f93] text-white font-bold py-2.5 px-5 rounded-full transition shadow-xs text-sm cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Skapa användare
            </button>
          </div>
        )}
      </div>

      {/* Medlemslista */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {members.map(({ user, role }) => {
            if (role === "OWNER") {
              return (
                <li
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 bg-amber-50/60 hover:bg-amber-50 border-l-4 border-l-amber-500 border-b-2 border-b-amber-200 transition-colors gap-4"
                >
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => setSelectedUser(user)}
                  >
                    <UserListItem user={user} />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Crown className="w-3.5 h-3.5 text-amber-600" /> Ägare
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 rounded-full transition cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" /> Detaljer
                    </button>
                  </div>
                </li>
              );
            }

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
                  {role === "ADMIN" && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      Admin
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" /> Detaljer
                  </button>

                  {canManageOrg && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(user.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-full transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Ta bort
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modal: Lämna över organisation */}
      {isTransferModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          onClick={() => setIsTransferModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Lämna över organisation
              </h3>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleTransferOwnership} className="mt-4 space-y-4">
              <p className="text-sm text-gray-600">
                Välj vilken befintlig medlem som ska ta över ägarskapet för{" "}
                <span className="font-semibold">
                  {activeOrganization?.name}
                </span>
                .
              </p>

              <div>
                <label
                  htmlFor="newOwner"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1"
                >
                  Ny organisationsägare
                </label>
                <select
                  id="newOwner"
                  value={newOwnerId}
                  onChange={(e) => setNewOwnerId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
                >
                  <option value="">-- Välj medlem --</option>
                  {nonOwnerMembers.map(({ user }) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              {transferError && (
                <div className="p-3 rounded-lg text-sm font-medium border bg-red-50 border-red-200 text-red-800">
                  {transferError}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={transferLoading}
                  className="px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-full transition shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {transferLoading ? "Sparar..." : "Lämna över"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={loadUsers}
        />
      )}

      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onUserCreated={loadUsers}
        />
      )}

      {isAddToOrgModalOpen && (
        <AddUserToOrgModal
          onClose={() => setIsAddToOrgModalOpen(false)}
          onUserAdded={loadUsers}
          existingMemberIds={members.map((m) => m.user.id)}
        />
      )}
    </div>
  );
};

export default UserList;