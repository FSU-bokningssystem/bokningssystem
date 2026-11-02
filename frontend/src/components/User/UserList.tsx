import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserListItem from "./UserListItem";
import type { userData } from "../../types/types";

const UserList = ({ users }: { users: userData[] }) => {
	const { loginAs, currentUser } = useAuth();

	return (
		<>
			<div className="flex justify-end py-2">
				<Link
					to="/create-user"
					className="rounded border-2 px-3 py-1 hover:bg-white hover:text-black"
				>
					+ Skapa ny användare
				</Link>
			</div>

			<ul>
				{users.map((user) => (
					<li key={user.id} className="flex items-center justify-between border-b-2 py-2">
						<UserListItem user={user} />
						<button
							onClick={() => loginAs(user)}
							disabled={currentUser?.id === user.id}
						>
							{currentUser?.id === user.id ? "Inloggad" : "Logga in som"}
						</button>
					</li>
				))}
			</ul>
		</>
	);
};

export default UserList;