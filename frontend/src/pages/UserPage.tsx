import UserList from "../components/UserList";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";

const UserPage = () => {
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
export default UserPage;
