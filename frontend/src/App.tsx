import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { fetchFromApi } from "./api/fetchData";
import UserList from "./User/UserList";

const App = () => {
	const {
		data: userlist,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: () => fetchFromApi("users"),
	});
	if (isLoading) return <p>Laddar användare...</p>;
	if (error) return <p>Ett fel uppstod: {error.message}</p>;

	return (
		<>
			<UserList users={userlist || []} />
		</>
	);
};

export default App;
