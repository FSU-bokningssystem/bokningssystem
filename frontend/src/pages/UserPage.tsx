import UserList from "../components/User/UserList";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../UI/LoadingSpinner";

const UserPage = () => {
	const {
		data: userlist,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: () => fetchFromApi("users"),
	});
	if (isLoading) return <LoadingSpinner />;
	if (error) return <p>Ett fel uppstod: {error.message}</p>;
	return (
		<>
			<UserList users={userlist || []} />
		</>
	);
};
export default UserPage;
