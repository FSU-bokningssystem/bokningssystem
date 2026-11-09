import { CalendarDays, Clock, House, User, Users } from "lucide-react";
import type { BookingData, BookingUser } from "../../types/types";

const MyBookingCard = ({ booking }: { booking: BookingData }) => {
	const start = new Date(booking.startTime);
	const end = new Date(booking.endTime);
	const durationMinutes = Math.round(
		(end.getTime() - start.getTime()) / 60_000,
	);
	const isPast = end < new Date();

	const dateFormatter = new Intl.DateTimeFormat("sv-SE", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const timeFormatter = new Intl.DateTimeFormat("sv-SE", {
		hour: "2-digit",
		minute: "2-digit",
	});

	const formatDuration = (minutes: number) => {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		if (h && m) return `${h} h ${m} min`;
		if (h) return `${h} h`;
		return `${m} min`;
	};

	const initials = (u: BookingUser) =>
		`${u.firstName.charAt(0)}${u.lastName.charAt(0)}`.toUpperCase();

	return (
		<li
			className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg border transition-colors ${
				isPast
					? "bg-gray-50 border-gray-100 opacity-70"
					: "bg-white border-gray-200 hover:border-[#0058a3]/40"
			}`}>
			{/* Datumblock */}
			<div className="flex sm:flex-col items-center sm:justify-center gap-2 sm:gap-0 sm:w-20 shrink-0 rounded-lg bg-[#0058a3]/5 text-[#0058a3] px-3 py-2">
				<span className="text-xs font-bold uppercase tracking-wider">
					{start.toLocaleDateString("sv-SE", { month: "short" })}
				</span>
				<span className="text-2xl font-bold leading-none">
					{start.getDate()}
				</span>
			</div>

			{/* Innehåll */}
			<div className="flex-1 min-w-0 space-y-2">
				<div className="flex justify-between items-start gap-2 flex-wrap">
					<h4 className="text-lg font-semibold text-gray-900">
						{booking.title}
					</h4>
					<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
						<Clock className="w-3 h-3" />
						{formatDuration(durationMinutes)}
					</span>
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
					<span className="inline-flex items-center gap-1.5">
						<CalendarDays className="w-4 h-4 text-gray-400" />
						{dateFormatter.format(start)}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock className="w-4 h-4 text-gray-400" />
						{timeFormatter.format(start)} – {timeFormatter.format(end)}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<House className="w-4 h-4 text-gray-400" />
						{booking.houseName} - {booking.roomName}
					</span>
				</div>

				{booking.description && (
					<p className="text-sm text-gray-700 leading-relaxed">
						{booking.description}
					</p>
				)}

				<div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
					<span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
						<User className="w-4 h-4 text-gray-400" />
						Bokad av{" "}
						<span className="font-medium text-gray-900">
							{booking.owner.firstName} {booking.owner.lastName}
						</span>
					</span>

					{booking.participants.length > 0 && (
						<div className="flex items-center gap-2">
							<Users className="w-4 h-4 text-gray-400" />
							<div className="flex -space-x-2">
								{booking.participants.map((u, index) => (
									<span
										key={index}
										title={`${u.firstName} ${u.lastName}`}
										className="w-8 h-8 rounded-full bg-[#0058a3] text-white text-xs font-semibold flex items-center justify-center ring-2 ring-white">
										{initials(u)}
									</span>
								))}
							</div>
							<span className="text-xs text-gray-500">
								{booking.participants.length} deltagare
							</span>
						</div>
					)}
				</div>
			</div>
		</li>
	);
};

export default MyBookingCard;
