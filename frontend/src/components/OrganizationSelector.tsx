import React from "react";
import { useAuth } from "../context/AuthContext";
import { Building2 } from 'lucide-react';

const OrganizationSelector: React.FC = () => {
  const { userOrganizations, activeOrganization, switchOrganization, loading } = useAuth();

  if (!activeOrganization && userOrganizations.length === 0) {
    return null;
  }

  // Om användaren bara har 1 organisation visar vi bara namnet
  if (userOrganizations.length <= 1) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full border border-gray-200">
        <Building2 className="w-3.5 h-3.5 text-[#0058a3]" />
        <span>{activeOrganization?.name || userOrganizations[0]?.name || 'Ingen organisation'}</span>
      </div>
    );
  }

  // Om användaren är medlem i fler än 1 organisation visar vi en dropdown
  return (
    <div className="relative inline-flex items-center gap-2">
      <Building2 className="w-4 h-4 text-gray-500" />
      <select
        value={activeOrganization?.id || ''}
        onChange={(e) => switchOrganization(Number(e.target.value))}
        disabled={loading}
        className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition cursor-pointer disabled:opacity-50"
      >
        {userOrganizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default OrganizationSelector;