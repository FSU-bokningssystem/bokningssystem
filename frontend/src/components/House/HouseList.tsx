import HouseListItem from "./HouseListItem";

const HouseList = ({ houses }: { houses: any[] }) => {
	return (
		<div>
			{houses.map((house) => (
				<HouseListItem key={house.id} house={house} />
			))}
		</div>
	);
};
export default HouseList;
