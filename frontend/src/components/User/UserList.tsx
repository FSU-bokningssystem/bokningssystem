import UserListItem from "./UserListItem";
const UserList = ({ users }: { users: any[] }) => {
	return (
		<div>
			{users.map((user) => (
				<UserListItem key={user.id} user={user} />
			))}
		</div>
	);
};
export default UserList;
