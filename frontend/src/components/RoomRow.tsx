const RoomRow = (props) => {
  return (
    <tr className="hover:bg-gray-500">
      <td className="border border-gray-300 px-4 py-2 align-top">
        <p>{props.name}</p>
      </td>
      <td className="border border-gray-300 px-4 py-2 align-top">
        {props.floor}
      </td>
    </tr>
  );
};
export default RoomRow;
