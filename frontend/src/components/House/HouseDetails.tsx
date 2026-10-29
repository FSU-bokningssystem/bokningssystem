import { useOutletContext } from "react-router-dom";
import type { houseWithRoomsData } from "../../types/types";

const HouseDetails = () => {
	const theHouse: houseWithRoomsData = useOutletContext();
	return (
		<>
			<h3>{theHouse.name}</h3>
			<p>Tillhörande {theHouse.organizationName}.</p>
			<p>
				{theHouse.street} {theHouse.streetNumber}
			</p>
			<p>
				{theHouse.zipCode} {theHouse.city}
			</p>
			<p></p>
			<p>{theHouse.timeZone}</p>
		</>
	);
};
export default HouseDetails;
