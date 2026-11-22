import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { fetchFromApi } from "../../api/fetchData";
import { postToApi } from "../../api/postData";
import { deleteFromApi } from "../../api/deleteData";
import type { BookingData, BookingUser, OrgMember } from "../../types";

interface ManageParticipantsPanelProps {
    bookingId: number;
    ownerId: number;
    orgId: number;
    participants: BookingUser[];
    onBookingUpdated?: (updatedBooking: BookingData) => void;
}

const ManageParticipantsPanel = ({
    bookingId,
    ownerId,
    orgId,
    participants,
    onBookingUpdated,
}: ManageParticipantsPanelProps) => {
    const queryClient = useQueryClient();
    const [selectedUserId, setSelectedUserId] = useState<number | "">("");
    const [error, setError] = useState<string | null>(null);

    // Hämta alla medlemmar i organisationen
    const { data: members = [], isLoading } = useQuery<OrgMember[]>({
        queryKey: ["orgMembers", orgId],
        queryFn: () => fetchFromApi(`membership/organization/${orgId}`),
        enabled: !!orgId,
    });

    // Filtrera bort bokningsägaren och de som redan är deltagare
    const participantIds = new Set(participants.map((p) => p.id));
    const availableMembers = members.filter(
        (m) => m.userId !== ownerId && !participantIds.has(m.userId),
    );

    const handleSuccess = (updatedBooking?: BookingData) => {
        setError(null);
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["userOrgBookings"] });
        if (updatedBooking && onBookingUpdated) {
            onBookingUpdated(updatedBooking);
        }
    };

    const addMutation = useMutation({
		mutationFn: (userId: number) =>
			postToApi(`booking/${bookingId}/participants/${userId}`, {}),
		onSuccess: (_data, addedUserId) => {
			setSelectedUserId("");
			setError(null);
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
			queryClient.invalidateQueries({ queryKey: ["userOrgBookings"] });

			// Hitta medlemmen som just lades till och lägg in i deltagarlistan direkt
			const addedMember = members.find((m) => m.userId === addedUserId);
			if (addedMember && onBookingUpdated) {
				const newParticipant: BookingUser = {
					id: addedMember.userId,
					firstName: addedMember.firstName,
					lastName: addedMember.lastName,
                    email: "",
                    phoneNumber: "",
                    timeZone: "",
				};
				onBookingUpdated({
					id: bookingId,
					participants: [...participants, newParticipant],
				} as BookingData);
			}
		},
		onError: (err: Error) => setError(err.message),
	});

    const removeMutation = useMutation({
		mutationFn: (userId: number) =>
			deleteFromApi(`booking/${bookingId}/participants/${userId}`),
		onSuccess: (_data, removedUserId) => {
			// Eftersom deleteFromApi returnerar void bygger vi en uppdaterad lista lokalt
			const updatedParticipants = participants.filter(
				(p) => p.id !== removedUserId,
			);
			handleSuccess({
				id: bookingId,
				participants: updatedParticipants,
			} as BookingData);
		},
		onError: (err: Error) => setError(err.message),
	});

    const isBusy = addMutation.isPending || removeMutation.isPending;

    return (
		<div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
			<h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">
				Hantera deltagare
			</h5>

			{/* Nuvarande deltagare med ta-bort-kryss */}
			{participants.length > 0 ? (
				<ul className="flex flex-wrap gap-2">
					{participants.map((p) => (
						<li
							key={p.id}
							className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800 shadow-2xs">
							<span>
								{p.firstName} {p.lastName}
							</span>
							<button
								type="button"
								disabled={isBusy}
								onClick={() => removeMutation.mutate(p.id)}
								title={`Ta bort ${p.firstName} ${p.lastName}`}
								className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer disabled:opacity-50">
								<X className="h-3.5 w-3.5" />
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-xs text-gray-500">
					Inga deltagare inbjudna till detta möte ännu.
				</p>
			)}

			{/* Dropdown + knapp för att lägga till */}
			<div className="flex flex-col sm:flex-row gap-2">
				<select
					value={selectedUserId}
					onChange={(e) =>
						setSelectedUserId(
							e.target.value ? Number(e.target.value) : "",
						)
					}
					disabled={isLoading || isBusy}
					className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]">
					<option value="">
						{isLoading
							? "Hämtar organisationsmedlemmar..."
							: availableMembers.length === 0
								? "Inga fler medlemmar att lägga till"
								: "Välj deltagare från organisationen…"}
					</option>
					{availableMembers.map((m) => (
						<option key={m.userId} value={m.userId}>
							{m.firstName} {m.lastName}
						</option>
					))}
				</select>

				<button
					type="button"
					disabled={selectedUserId === "" || isBusy}
					onClick={() =>
						selectedUserId !== "" &&
						addMutation.mutate(selectedUserId)
					}
					className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0058a3] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#004f93] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					<UserPlus className="h-3.5 w-3.5" />
					Lägg till
				</button>
			</div>

			{error && (
				<p className="text-xs text-red-600" role="alert">
					{error}
				</p>
			)}
		</div>
	);
};

export default ManageParticipantsPanel;