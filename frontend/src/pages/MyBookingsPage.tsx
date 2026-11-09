import { useAuth } from "../context/AuthContext";
import BookingCalendar from "../components/Booking/BookingCalendar";

const MyBookingsPage = () => {
	const auth = useAuth();

	if (!auth?.currentUser)
		return <p className="text-gray-600">Ingen användare är inloggad.</p>;

	const bookings = auth?.bookings || [];

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h2 className="text-2xl font-bold text-gray-900 mb-4">Mina Bokningar</h2>
			<BookingCalendar bookings={bookings} />
		</div>
	);
};
export default MyBookingsPage;
