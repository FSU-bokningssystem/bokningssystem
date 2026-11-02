import HouseListItem from "./HouseListItem";

const HouseList = ({ houses }: { houses: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {houses.map((house) => (
        <HouseListItem key={house.id} house={house} />
      ))}
    </div>
  );
};
export default HouseList;