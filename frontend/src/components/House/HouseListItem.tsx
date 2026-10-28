import type { houseData } from "../../types/types";
import { NavLink } from "react-router-dom";

const HouseListItem = ({ house }: { house: houseData }) => {
	return (
		<li key={house.id}>
			<NavLink to={`/houses/${house.id}`}>
				{house.name} – {house.organizationName}, {house.city}
			</NavLink>
		</li>
	);
};
export default HouseListItem;
