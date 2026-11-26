import type {
	HouseModalProps,
	HouseFormValues,
	OrganizationShortData,
	OrgMember,
} from "../../types";
import { BuildingComplexPlus, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFromApi } from "../../api/fetchData";
import LoadingSpinner from "../../UI/LoadingSpinner";
import TimeZoneList from "../Common/TimeZoneList";
import { useState } from "react";
import ManageHouseOwnersPanel from "./ManageHouseOwnersPanel";

const AddHouseModal = ({ onClose, submitData }: HouseModalProps) => {
	const auth = useAuth();
	const queryClient = useQueryClient();

	const [orgId, setOrgId] = useState<number | undefined>(
		auth.userRole === "ADMIN" ? undefined : auth.activeOrganization?.id,
	);
	const updateOrgId = (id: number) => {
		setOrgId(id);
		queryClient.invalidateQueries({ queryKey: ["organizations"] });
	};
	//Skapa en state som innehåller husets blivande ägare.
	const [owners, setOwners] = useState<OrgMember[]>([]);

	//Lägg till/ta bort en ägare i arrayen med ägare.
	const addOwner = (newOwner: OrgMember) => {
		setOwners((currentOwners) => [...currentOwners, newOwner]);
	};

	const removeOwner = (removedOwner: OrgMember) => {
		setOwners((currentOwners) =>
			currentOwners.filter((owner) => owner.userId !== removedOwner.userId),
		);
	};

	//Defaultvärde för tidszon sätts till antingen användarens systems tidszon eller, om det saknas, Europe/Stockholm.
	const browserZone =
		Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Stockholm";

	//Hämtar organisationslista, returnerar Loadingspinner medan det pågår och ger felmeddelande om det misslyckas.
	const {
		data: organizationlist,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["organizations"],
		queryFn: () => fetchFromApi<OrganizationShortData[]>("organization"),
	});

	if (isLoading) return <LoadingSpinner />;
	if (error)
		return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		if (Number.isNaN(orgId)) {
			alert("Du måste välja en organisation!");
			return;
		}
		const values: HouseFormValues = {
			name: formData.get("name") as string,
			street: formData.get("streetName") as string,
			streetNumber: formData.get("streetNumber") as string,
			zipCode: formData.get("zipCode") as string,
			city: formData.get("city") as string,
			timeZone: formData.get("timeZone") as string,
			organizationId: orgId,
			ownerIds: owners.map((owner) => owner.userId),
		};

		submitData();
	};
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
			onClick={onClose}>
			<div
				className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-200"
				onClick={(e) => e.stopPropagation()}>
				<div className="flex items-center justify-between border-b border-gray-100 pb-4">
					<h3 className="text-lg font-bold text-gray-900">Lägg till hus</h3>
					<button
						onClick={onClose}
						type="button"
						className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition">
						<X className="h-5 w-5" />
						<span className="sr-only">Stäng</span>
					</button>
				</div>
				<form onSubmit={handleSubmit} className="mt-4 space-y-4">
					{auth.userRole === "ADMIN" && (
						<div>
							<label
								htmlFor="organisation"
								className="block text-xs font-bold text-gray-700 uppercase mb-1">
								Organisation
							</label>
							<select
								name="organization"
								id="organization"
								className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
								onChange={(e) => setOrgId(Number(e.currentTarget.value))}>
								{organizationlist?.map((org) => (
									<option key={org.id} value={org.id}>
										{org.name}
									</option>
								))}
							</select>
						</div>
					)}
					<div>
						<label
							htmlFor="name"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Namn
						</label>
						<input
							type="text"
							name="name"
							id="name"
							className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
							placeholder="Ex. AB Ruffel & Båg"
							required
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="streetName"
								className="block text-xs font-bold text-gray-700 uppercase mb-1">
								Gatunamn
							</label>
							<input
								type="text"
								name="streetName"
								id="streetName"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
								placeholder="Gatugatan"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="streetNumber"
								className="block text-xs font-bold text-gray-700 uppercase mb-1">
								Gatunummer
							</label>
							<input
								type="text"
								name="streetNumber"
								id="streetNumber"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
								placeholder="42A"
								required
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="zipCode"
								className="block text-xs font-bold text-gray-700 uppercase mb-1">
								Postnummer
							</label>
							<input
								type="text"
								name="zipCode"
								id="zipCode"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
								placeholder="12345"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="city"
								className="block text-xs font-bold text-gray-700 uppercase mb-1">
								Stad
							</label>
							<input
								type="text"
								name="city"
								id="city"
								className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 focus:border-[#0058a3] focus:ring-[#0058a3]"
								placeholder="Bystaden"
								required
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="timeZone"
							className="block text-xs font-bold text-gray-700 uppercase mb-1">
							Tidszon
						</label>
						<select
							id="timeZone"
							name="timeZone"
							className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0058a3] focus:border-[#0058a3] transition"
							defaultValue={browserZone}>
							<TimeZoneList />
						</select>
					</div>
					<div className="flex items-center justify-end space-x-3 border-t border-gray-100 pt-4">
						<button
							onClick={onClose}
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition">
							Avbryt
						</button>
						<button
							type="submit"
							disabled={Number.isNaN(orgId)}
							className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0058a3] hover:bg-[#004f93] rounded-full transition shadow-xs disabled:opacity-50">
							<BuildingComplexPlus className="h-4 w-4" />
							Skapa
						</button>
					</div>
					<ManageHouseOwnersPanel
						orgId={orgId}
						owners={owners}
						addOwner={addOwner}
						removeOwner={removeOwner}
					/>
				</form>
			</div>
		</div>
	);
};
export default AddHouseModal;
