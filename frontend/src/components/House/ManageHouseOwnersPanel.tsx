import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, X } from "lucide-react";
import { fetchFromApi } from "../../api/fetchData";
import type { OrgMember } from "../../types";

const EMPTY_MEMBERS: OrgMember[] = [];

interface ManageHouseOwnersPanelProps {
	orgId: number | undefined;
	owners: OrgMember[];
	addOwner: (owner: OrgMember) => void;
	removeOwner: (owner: OrgMember) => void;
}

const ManageHouseOwnersPanel = ({
	orgId,
	owners,
	addOwner,
	removeOwner,
}: ManageHouseOwnersPanelProps) => {
	const [selectedUserId, setSelectedUserId] = useState<number>(0);

	//Skapar en state med medlemmar i organisationen som inte är husägare samt funktioner för att flytta en orgmedlem från icke-ägare till ägare och vice versa.
	const [nonOwnerList, setNonOwnerList] = useState<OrgMember[]>([]);

	const putInOwnerList = (id: number) => {
		const addedOwner = members.find((member) => member.userId === id);
		if (!addedOwner) return;
		setNonOwnerList((currentNonOwnerList) =>
			currentNonOwnerList.filter((owner) => owner.userId !== id),
		);
		addOwner(addedOwner);
	};

	const removeFromOwnerList = (id: number) => {
		const removedMember = members.find((member) => member.userId === id);
		if (!removedMember) return;
		setNonOwnerList((currentNonOwnerList) => [
			...currentNonOwnerList,
			removedMember,
		]);
		removeOwner(removedMember);
	};

	// Hämta alla medlemmar i organisationen

	const {
		data: members = EMPTY_MEMBERS,
		isLoading,
		isError,
	} = useQuery<OrgMember[]>({
		queryKey: ["orgMembers", orgId],
		queryFn: () => fetchFromApi(`membership/organization/${orgId}`),
		enabled: !!orgId,
	});

	//När members ändras (dvs när queryn körs) uppdatera nonOwnerList till att vara lika med Members.
	useEffect(() => {
		setNonOwnerList(members);
	}, [members]);

	return (
		<div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
			<h5 className="text-xs font-bold uppercase tracking-wider text-gray-700">
				Hantera ägare
			</h5>

			{/* Nuvarande ägare med ta-bort-kryss */}
			{owners.length > 0 ? (
				<ul className="flex flex-wrap gap-2">
					{owners.map((o) => (
						<li
							key={o.userId}
							className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800 shadow-2xs">
							<span>
								{o.firstName} {o.lastName}
							</span>
							<button
								type="button"
								onClick={() => removeFromOwnerList(o.userId)}
								title={`Ta bort ${o.firstName} ${o.lastName}`}
								className="rounded-full p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer disabled:opacity-50">
								<X className="h-3.5 w-3.5" />
							</button>
						</li>
					))}
				</ul>
			) : (
				<p className="text-xs text-gray-500">Detta hus har ännu inga ägare.</p>
			)}

			{/* Dropdown + knapp för att lägga till */}
			<div className="flex flex-col sm:flex-row gap-2">
				<select
					defaultValue=""
					onChange={(e) => setSelectedUserId(Number(e.target.value))}
					disabled={isLoading}
					className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]">
					<option value="" disabled={true}>
						{isLoading
							? "Hämtar organisationsmedlemmar..."
							: nonOwnerList.length === 0
								? "Inga fler medlemmar att lägga till"
								: "Välj medlemmar från organisationen…"}
					</option>
					{nonOwnerList.map((m) => (
						<option key={m.userId} value={m.userId}>
							{m.firstName} {m.lastName}
						</option>
					))}
				</select>

				<button
					type="button"
					onClick={() => putInOwnerList(selectedUserId)}
					className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0058a3] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#004f93] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
					<UserPlus className="h-3.5 w-3.5" />
					Lägg till
				</button>
			</div>

			{isError && (
				<p className="text-xs text-red-600" role="alert">
					Fel vid inläsning av organisationsmedlemmar.
				</p>
			)}
		</div>
	);
};

export default ManageHouseOwnersPanel;
