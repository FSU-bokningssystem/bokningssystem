import type { houseData } from "../../types/types";
import { NavLink } from "react-router-dom";

const HouseListItem = ({ house }: { house: houseData }) => {
	return (
		<li
			key={house.id}
			className="font-sans text-white border-yellow-50 border-2 rounded-2xl p-2">
			<NavLink to={`/houses/${house.id}`}>
				{house.name} – {house.organizationName}, {house.city}
			</NavLink>
		</li>
	);
};
export default HouseListItem;
