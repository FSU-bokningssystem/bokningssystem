import { useAuth } from "../../context/AuthContext";
import UserListItem from "./UserListItem";
import type { userData } from "../../types/types";

const UserList = ({ users }: { users: userData[] }) => {
	const { loginAs, currentUser } = useAuth();

	return (
		<ul>
			{users.map((user) => (
				<li key={user.id} className="flex items-center justify-between border-b-2 py-2">
					<UserListItem user={user} />
					<button 
						onClick={() => loginAs(user)}
						disabled={currentUser?.id === user.id}
					>
						{currentUser?.id === user.id ? 'Inloggad' : 'Logga in som'}
					</button>
				</li>
			))}
		</ul>
	);
};

export default UserList;