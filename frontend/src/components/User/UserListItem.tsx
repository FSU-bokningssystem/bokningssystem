import type { userData } from "../types/types";

const UserListItem = ({ user }: { user: userData }) => {
	return (
		<div className="user">
			<h3>{user.firstName + " " + user.lastName}</h3>
			<p>{user.email}</p>
		</div>
	);
};
export default UserListItem;
