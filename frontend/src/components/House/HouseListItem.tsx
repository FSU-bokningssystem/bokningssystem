import type { houseData } from "../../types/types";

const HouseListItem = ({ house }: { house: houseData }) => {
	return (
		<div>
			{house.name} – {house.organizationName}, {house.city}
		</div>
	);
};
export default HouseListItem;
