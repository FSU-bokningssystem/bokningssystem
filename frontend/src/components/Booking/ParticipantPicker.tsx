import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { fetchFromApi } from "../../api/fetchData";
import type { OrgMember } from "../../types/types";

interface ParticipantPickerProps {
    orgId: number;
    ownerId: number;
    selected: OrgMember[];
    onChange: (members: OrgMember[]) => void;
}

const ParticipantPicker = ({
    orgId,
    ownerId,
    selected,
    onChange,
}: ParticipantPickerProps) => {
    const [selectedUserId, setSelectedUserId] = useState<number | "">("");

    // Hämta alla medlemmar i organisationen
    const { data: members = [], isLoading } = useQuery<OrgMember[]>({
        queryKey: ["orgMembers", orgId],
        queryFn: () => fetchFromApi(`membership/organization/${orgId}`),
        enabled: !!orgId,
    });

    // Filtrera bort bokningsägaren och de som redan är valda
    const selectedIds = new Set(selected.map(m => m.userId));
    const availableMembers = members.filter(
        m => m.userId !== ownerId && !selectedIds.has(m.userId),
    );

    const handleAdd = () => {
        const member = members.find(m => m.userId === selectedUserId);
        if (!member) return;
        onChange([...selected, member]);
        setSelectedUserId("");
    };

    const handleRemove = (userId: number) => {
        onChange(selected.filter(m => m.userId !== userId));
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Deltagare
            </h5>

            {/* Valda deltagare med ta-bort-kryss */}
            {selected.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                    {selected.map(m => (
                        <li
                            key={m.userId}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800 shadow-2xs"
                        >
                            <span>
                                {m.firstName} {m.lastName}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRemove(m.userId)}
                                title={`Ta bort ${m.firstName} ${m.lastName}`}
                                className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-500">
                    Inga deltagare tillagda ännu.
                </p>
            )}

            {/* Dropdown + knapp för att lägga till */}
            <div className="flex flex-col sm:flex-row gap-2">
                <select
                    value={selectedUserId}
                    onChange={e =>
                        setSelectedUserId(
                            e.target.value ? Number(e.target.value) : "",
                        )
                    }
                    disabled={isLoading}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
                >
                    <option value="">
                        {isLoading
                            ? "Hämtar organisationsmedlemmar..."
                            : availableMembers.length === 0
                              ? "Inga fler medlemmar att lägga till"
                              : "Välj deltagare från organisationen…"}
                    </option>
                    {availableMembers.map(m => (
                        <option key={m.userId} value={m.userId}>
                            {m.firstName} {m.lastName}
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    disabled={selectedUserId === ""}
                    onClick={handleAdd}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0058a3] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#004f93] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UserPlus className="h-3.5 w-3.5" />
                    Lägg till
                </button>
            </div>
        </div>
    );
};

export default ParticipantPicker;
