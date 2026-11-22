import React, { useEffect, useState } from "react";
import { X, AlertTriangle, UserPlus } from "lucide-react";
import { MultiUserEmailSearch } from "./User/MultiUserEmailSearch";
import { useAuth } from "../context/AuthContext";
import { postToApi } from "../api/postData";

interface AddUserToOrgModalProps {
  onClose: () => void;
  onUserAdded: () => void;
  existingMemberIds?: number[];
}

const AddUserToOrgModal: React.FC<AddUserToOrgModalProps> = ({
  onClose,
  onUserAdded,
  existingMemberIds = [],
}) => {
  const { currentUser, activeOrganization } = useAuth();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [role, setRole] = useState<"MEMBER" | "OWNER">("MEMBER");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!activeOrganization || !currentUser || selectedUserIds.length === 0) return;

    if (role === "OWNER" && selectedUserIds.length > 1) {
      setStatusMessage({
        text: "Endast en person kan vara organisationsägare åt gången.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
    await Promise.all(
  selectedUserIds.map((targetUserId) =>
    postToApi("membership/organization/addMember", {
      userId: targetUserId,
      organizationId: activeOrganization.id,
      role: role,
    })
  )
);

      onUserAdded();
      onClose();
    } catch (err: any) {
      setStatusMessage({
        text: err.message || "Kunde inte lägga till medlemmar.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const tooManyOwnersSelected = role === "OWNER" && selectedUserIds.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-xl border border-gray-200 overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Lägg till medlemmar
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <MultiUserEmailSearch
            onUsersChange={(ids) => setSelectedUserIds(ids)}
            excludeUserId={currentUser?.id}
            excludeUserIds={existingMemberIds}
          />

          <div>
            <label
              htmlFor="memberRole"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1"
            >
              Roll i organisationen
            </label>
            <select
              id="memberRole"
              value={role}
              onChange={(e) => setRole(e.target.value as "MEMBER" | "OWNER")}
              className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
            >
              <option value="MEMBER">Medlem</option>
              <option value="OWNER">Ägare</option>
            </select>
          </div>

          {role === "OWNER" && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                Det kan bara finnas <strong>en</strong> ägare per organisation.
                Nuvarande ägare kommer automatiskt att ändras till medlem.
              </p>
            </div>
          )}

          {tooManyOwnersSelected && (
            <div className="p-3 rounded-lg text-sm font-medium border bg-red-50 border-red-200 text-red-800">
              Endast 1 person kan väljas för rollen Ägare.
            </div>
          )}

          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-sm font-medium border ${
                statusMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={
                selectedUserIds.length === 0 ||
                tooManyOwnersSelected ||
                loading
              }
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              {loading
                ? "Sparar..."
                : `Lägg till (${selectedUserIds.length})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserToOrgModal;