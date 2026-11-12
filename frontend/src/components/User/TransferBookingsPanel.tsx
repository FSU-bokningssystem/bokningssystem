import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFromApi } from "../../api/fetchData";
import { patchToApi } from "../../api/patchData";
import type {
  OrgMember,
  UserOrgBookings,
  BookingData,
} from "../../types/types";

interface TransferBookingsPanelProps {
  userId: number;
  orgId: number;
  orgName: string;
  onCancel: () => void;
  onRemove: () => void;
  isRemoving: boolean;
}

const formatTime = (iso: string) => iso.replace("T", " ").slice(0, 16);

// Visar användarens kommande bokningar i organisationen som han äger.
// Varje bokning måste få en ny ägare innan användaren kan tas bort.
const TransferBookingsPanel = ({
  userId,
  orgId,
  orgName,
  onCancel,
  onRemove,
  isRemoving,
}: TransferBookingsPanelProps) => {
  const queryClient = useQueryClient();
  const bookingsKey = ["userOrgBookings", userId, orgId];

  const { data: bookings, isLoading } = useQuery<UserOrgBookings>({
    queryKey: bookingsKey,
    queryFn: () => fetchFromApi(`booking/user/${userId}/organization/${orgId}`),
  });

  const { data: members = [] } = useQuery<OrgMember[]>({
    queryKey: ["orgMembers", orgId],
    queryFn: () => fetchFromApi(`membership/organization/${orgId}`),
  });

  const candidates = members.filter((m) => m.userId !== userId);
  const owned = bookings?.owned ?? [];

  if (isLoading) {
    return <p className="text-sm text-gray-500">Hämtar bokningar…</p>;
  }

  return (
    <div className="w-full space-y-3">
      {owned.length > 0 ? (
        <>
          <p className="text-sm text-gray-700">
            Användaren äger {owned.length} kommande{" "}
            {owned.length === 1 ? "möte" : "möten"} i {orgName}. Välj en ny
            ägare för varje möte innan hen kan tas bort.
          </p>
          <ul className="space-y-2">
            {owned.map((b) => (
              <TransferRow
                key={b.id}
                booking={b}
                candidates={candidates}
                onTransferred={() =>
                  queryClient.invalidateQueries({ queryKey: bookingsKey })
                }
              />
            ))}
          </ul>
        </>
      ) : (
        <p className="text-sm text-gray-700">
          Användaren äger inga kommande möten i {orgName}.
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"
        >
          Avbryt
        </button>
        <button
          type="button"
          disabled={owned.length > 0 || isRemoving}
          onClick={onRemove}
          className="px-4 py-2 text-sm font-bold text-white bg-[#a30000] hover:bg-[#800000] rounded-full transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ta bort ur {orgName}
        </button>
      </div>
    </div>
  );
};

interface TransferRowProps {
  booking: BookingData;
  candidates: OrgMember[];
  onTransferred: () => void;
}

const TransferRow = ({
  booking,
  candidates,
  onTransferred,
}: TransferRowProps) => {
  const [newOwnerId, setNewOwnerId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const transfer = useMutation({
    mutationFn: (ownerId: number) =>
      patchToApi(`booking/${booking.id}/owner`, { newOwnerId: ownerId }),
    onSuccess: () => {
      setError(null);
      onTransferred();
    },
    onError: (err: Error) => setError(err.message),
  });

  return (
    <li className="rounded-lg border border-gray-200 p-3 space-y-2">
      <div>
        <p className="text-sm font-semibold text-gray-900">{booking.title}</p>
        <p className="text-xs text-gray-500">
          Rum {booking.roomNumber} · {formatTime(booking.startTime)} –{" "}
          {formatTime(booking.endTime)}
        </p>
      </div>
      <div className="flex gap-2">
        <select
          value={newOwnerId}
          onChange={(e) =>
            setNewOwnerId(e.target.value ? Number(e.target.value) : "")
          }
          className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Välj ny ägare…</option>
          {candidates.map((m) => (
            <option key={m.userId} value={m.userId}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={newOwnerId === "" || transfer.isPending}
          onClick={() => newOwnerId !== "" && transfer.mutate(newOwnerId)}
          className="px-3 py-1 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Överför
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </li>
  );
};

export default TransferBookingsPanel;
