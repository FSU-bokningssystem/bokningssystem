import UserList from "../components/User/UserList";
import { useAuth } from "../context/AuthContext";

const UserPage = () => {
   const { activeOrganization } = useAuth();

  if (!activeOrganization?.id) return <p className="text-gray-500">Ingen aktiv organisation vald.</p>;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medlemmar</h1>
        <p className="text-sm text-gray-500">Klicka på en medlem för mer information</p>
      </div>
      <UserList/>
    </div>
  );
};
export default UserPage;