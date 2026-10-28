import RoomForm from "../components/RoomForm";
import Roomlist from "../components/RoomList";

const RoomPage = () => {
  return (
    <div className="flex flex-col p-8 w-full">
      <Roomlist></Roomlist>
      <div className="flex justify-between p-4 ">
        <RoomForm></RoomForm>
        <h3>RoomPage</h3>
      </div>
    </div>
  );
};
export default RoomPage;
