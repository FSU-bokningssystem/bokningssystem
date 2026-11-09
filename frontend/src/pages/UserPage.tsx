import UserList from "../components/User/UserList";
import { fetchFromApi } from "../api/fetchData";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../UI/LoadingSpinner";
import type { userData } from "../types/types";

const UserPage = () => {
  const {
    data: userlist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchFromApi<userData[]>("user"),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Användare</h1>
        <p className="text-sm text-gray-500">Välj konto att logga in som eller klicka på en användare för mer information</p>
      </div>
      <UserList users={userlist || []} />
    </div>
  );
};
export default UserPage;