import React, { useState, useEffect } from "react";
import { fetchFromApi } from "../../api/fetchData";
import type { userData } from "../../types/types";

interface UserEmailSearchProps {
  onSelectUser: (userId: number | null) => void;
}

export const UserEmailSearch: React.FC<UserEmailSearchProps> = ({ onSelectUser }) => {
  const [query, setQuery] = useState("");
  const [allUsers, setAllUsers] = useState<userData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<userData[]>([]);
  const [selectedUser, setSelectedUser] = useState<userData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Hämta alla användare via fetchFromApi mot "user"
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

  // Filtrera lista baserat på vad användaren skriver
  useEffect(() => {
    if (query.trim() === "" || selectedUser?.email === query) {
      setFilteredUsers([]);
      setIsOpen(false);
    } else {
      const matches = allUsers.filter((user) =>
        user.email?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(matches);
      setIsOpen(true);
    }
  }, [query, allUsers, selectedUser]);

  const handleSelect = (user: userData) => {
    setSelectedUser(user);
    setQuery(user.email);
    onSelectUser(user.id);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setQuery("");
    onSelectUser(null);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Organisationsansvarig (Sök på e-post) *
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Skriv för att söka e-post..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0058a3] focus:outline-none pr-16"
          required
        />
        {selectedUser && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
          >
            Ändra
          </button>
        )}
      </div>

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

      {isOpen && query.trim() !== "" && filteredUsers.length === 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-500 mt-1">
          Ingen användare hittades med den e-postadressen.
        </div>
      )}

      {selectedUser && (
        <p className="mt-1 text-xs text-green-600 font-semibold">
          Vald användare (ID: {selectedUser.id})
        </p>
      )}
    </div>
  );
};