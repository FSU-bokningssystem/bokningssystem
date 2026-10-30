import type { userData } from "../../types/types";

const UserListItem = ({ user } : { user : userData }) => {
	return (
		<div className="user">
			<h3>{user.firstName} {user.lastName} - {user.email}</h3>
		</div>
	);
};
export default UserListItem;
