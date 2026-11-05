import { CalendarX2 } from "lucide-react";
import type { bookingData } from "../../types/types";
import BookingCard from "../Room/RoomBookingCard";

const BookingCalendar = ({ bookings }: { bookings: bookingData[] }) => {
	const upcoming = bookings.filter(
		(booking: any) => new Date(booking.endTime) >= new Date(),
	);
	// const pastBookings = bookings.filter((booking: any) => new Date(booking.endTime) < new Date());
	// Används inte just nu, men kan vara användbart i framtiden om man vill visa historik för bokningar.

	return (
		<>
			<div className="bg-white p-6 mt-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
				<div className="flex justify-between items-center flex-wrap gap-2">
					<div>
						<span className="text-xs font-bold text-[#0058a3] uppercase tracking-wider">
							Kalender
						</span>
						<h3 className="text-2xl font-bold text-gray-900">Bokningar</h3>
					</div>
					{upcoming && (
						<span className="text-sm text-gray-500">
							{upcoming.length}{" "}
							{upcoming.length === 1 ? "bokning" : "bokningar"}
						</span>
					)}
				</div>

				{upcoming && upcoming.length === 0 && (
					<div className="flex flex-col items-center gap-2 py-10 text-gray-500">
						<CalendarX2 className="w-8 h-8 text-gray-300" />
						<p className="text-sm">Inga bokningar ännu.</p>
					</div>
				)}

				{upcoming.length > 0 && (
					<ul className="space-y-3">
						{upcoming.map((b) => (
							<BookingCard key={b.id} booking={b} />
						))}
					</ul>
				)}
			</div>
		</>
	);
};
export default BookingCalendar;
