import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchFromApi } from "../api/fetchData";
import LoadingSpinner from "../UI/LoadingSpinner";
import BookingCalendar from "../components/Booking/BookingCalendar";

const MyBookingsPage = () => {
	const auth = useAuth();

	if (!auth?.currentUser)
		return <p className="text-gray-600">Ingen användare är inloggad.</p>;
	const {
		data: me,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["userwithbookings", auth?.currentUser?.id],
		queryFn: () => fetchFromApi("user/withbookings/" + auth?.currentUser?.id),
	});
	if (isLoading) return <LoadingSpinner />;
	if (error)
		return <p className="text-red-600">Ett fel uppstod: {error.message}</p>;

	const bookings = me?.bookings || [];

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Mina Bokningar</h2>
			<BookingCalendar bookings={bookings} />
		</div>
	);
};
export default MyBookingsPage;
