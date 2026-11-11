import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postToApi } from "../api/postData";
import { UserEmailSearch } from "../components/User/UserEmailSearch";
import { MultiUserEmailSearch } from "../components/User/MultiUserEmailSearch";

export const CreateOrganizationPage: React.FC = () => {
  const [name, setName] = useState("");
  const [organizationHostId, setOrganizationHostId] = useState<number | null>(null);
  const [memberUserIds, setMemberUserIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError("Organisationsnamnet måste vara minst 3 tecken långt.");
      return;
    }

    if (!organizationHostId) {
      setError("Du måste söka upp och välja en organisationsansvarig (ägare).");
      return;
    }

    setLoading(true);

    try {
      await postToApi("organization/create", {
        id: null,
        name: name.trim(),
        organizationHostId: organizationHostId,
        memberUserIds: memberUserIds, // Skickar listan över vanliga medlemmar
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Det gick inte att skapa organisationen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Skapa Organisation</h1>
      <p className="text-sm text-gray-500 mb-6">Fyll i uppgifterna för den nya organisationen.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organisationsnamn *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="T.ex. BRF Solen"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0058a3] focus:outline-none"
            required
            disabled={loading}
          />
        </div>

        {/* 1. Sökfält för Ägare (OWNER) */}
        <UserEmailSearch onSelectUser={(id) => setOrganizationHostId(id)} />

        {/* 2. Sökfält för extra Medlemmar (MEMBER) */}
        <MultiUserEmailSearch
          onUsersChange={(ids) => setMemberUserIds(ids)}
          excludeUserId={organizationHostId}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0058a3] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#004785] transition disabled:opacity-50 mt-4"
        >
          {loading ? "Skapar..." : "Skapa Organisation"}
        </button>
      </form>
    </div>
  );
};

export default CreateOrganizationPage;