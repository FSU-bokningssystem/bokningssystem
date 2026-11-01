import { useOutletContext } from "react-router-dom";
import type { houseWithRoomsData } from "../../types/types";

const HouseDetails = () => {
	const theHouse: houseWithRoomsData = useOutletContext();
	return (
		<>
			<h3 className="font-sans text-xl text-white font-bold">
				{theHouse.name}
			</h3>
			<p className="font-sans text-white">
				Tillhörande {theHouse.organizationName}.
			</p>
			<p className="font-sans text-white">
				{theHouse.street} {theHouse.streetNumber}
			</p>
			<p className="font-sans text-white">
				{theHouse.zipCode} {theHouse.city}
			</p>
			<p></p>
			<p className="font-sans text-white">Tidszon: {theHouse.timeZone}</p>
		</>
	);
};
export default HouseDetails;
