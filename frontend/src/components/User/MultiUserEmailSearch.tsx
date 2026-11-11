import React, { useState, useEffect } from "react";
import { fetchFromApi } from "../../api/fetchData";
import type { userData } from "../../types/types";

interface MultiUserEmailSearchProps {
  onUsersChange: (userIds: number[]) => void;
  excludeUserId?: number | null; // För att undvika att välja samma person som host
}

export const MultiUserEmailSearch: React.FC<MultiUserEmailSearchProps> = ({
  onUsersChange,
  excludeUserId,
}) => {
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<userData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userData[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<userData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchFromApi<userData[]>("user");
        setAllUsers(data);
      } catch (err) {
        console.error("Fel vid hämtning av användare:", err);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredUsers([]);
      setIsOpen(false);
    } else {
      const matches = allUsers.filter(
        (user) =>
          user.email?.toLowerCase().includes(query.toLowerCase()) &&
          user.id !== excludeUserId &&
          !selectedUsers.some((selected) => selected.id === user.id)
      );
      setFilteredUsers(matches);
      setIsOpen(true);
    }
  }, [query, allUsers, selectedUsers, excludeUserId]);

  const handleSelect = (user: userData) => {
    const updated = [...selectedUsers, user];
    setSelectedUsers(updated);
    onUsersChange(updated.map((u) => u.id));
    setQuery("");
    setIsOpen(false);
  };

  const handleRemove = (userId: number) => {
    const updated = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(updated);
    onUsersChange(updated.map((u) => u.id));
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Lägg till medlemmar (Sök på e-post)
      </label>
      
      {/* Valda medlemmar som taggar */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#0058a3] text-xs font-semibold rounded-full border border-blue-200"
            >
              {user.email}
              <button
                type="button"
                onClick={() => handleRemove(user.id)}
                className="hover:text-red-600 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sök och lägg till fler medlemmar..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0058a3] focus:outline-none"
      />

      {isOpen && filteredUsers.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelect(user)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800 flex justify-between items-center"
            >
              <span>{user.email}</span>
              {(user.firstName || user.lastName) && (
                <span className="text-gray-400 text-xs">
                  {user.firstName ?? ""} {user.lastName ?? ""}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};