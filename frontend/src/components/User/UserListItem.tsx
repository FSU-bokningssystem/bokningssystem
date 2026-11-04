import type { userData } from "../../types/types";

const UserListItem = ({ user }: { user: userData }) => {
  return (
    <div className="space-y-0.5">
      <h3 className="font-bold text-gray-900 text-base">
        {user.firstName + " " + user.lastName}
      </h3>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  );
};
export default UserListItem;