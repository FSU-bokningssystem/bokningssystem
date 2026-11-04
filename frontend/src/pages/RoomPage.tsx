import RoomForm from "../components/RoomForm";

const RoomPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hantera Lokaler</h1>
        <p className="text-sm text-gray-500">Lägg till och granska alla lokaler för respektive hus</p>
      </div>
      <RoomForm />
    </div>
  );
};
export default RoomPage;