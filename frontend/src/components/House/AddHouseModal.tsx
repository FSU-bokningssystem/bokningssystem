import type { HouseModalProps, OrganizationShortData } from "../../types";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchFromApi } from "../../api/fetchData";
import LoadingSpinner from "../../UI/LoadingSpinner";

const AddHouseModal = ({ onClose, submitData }: HouseModalProps) => {
	const auth = useAuth();

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		/* const formData = new FormData(e.currentTarget);
          const floor = formData.get("floor") as string;
          const values: roomFormValues = {
              roomNumber: formData.get("roomNumber") as string,
              floor: floor ? Number(floor) : null,
              name: formData.get("name") as string,
              description: formData.get("description") as string,
          }; */

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
							<select>
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
				</form>
			</div>
		</div>
	);
};
export default AddHouseModal;
