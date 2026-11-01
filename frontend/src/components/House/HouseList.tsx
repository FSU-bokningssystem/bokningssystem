import HouseListItem from "./HouseListItem";

const HouseList = ({ houses }: { houses: any[] }) => {
	return (
		<ul className="list-none m-1 flex-row md:flex-column">
			{houses.map((house) => (
				<HouseListItem key={house.id} house={house} />
			))}
		</ul>
	);
};
export default HouseList;
