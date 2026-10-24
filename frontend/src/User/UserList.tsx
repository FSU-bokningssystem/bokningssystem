import User from "./User";
const UserList = ({ users }: { users: any[] }) => {
	return (
		<div>
			{users.map((user) => (
				<User key={user.id} user={user} />
			))}
		</div>
	);
};
export default UserList;
