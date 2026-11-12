import { useQuery } from "@tanstack/react-query";
import { CalendarX2 } from "lucide-react";
import { fetchFromApi } from "../../api/fetchData";
import type { BookingData, RoomBookingDetailsProps } from "../../types/types";
import BookingCard from "./RoomBookingCard";

const RoomBookingDetails = ({ roomId }: RoomBookingDetailsProps) => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery<BookingData[]>({
    queryKey: ["bookinglist", roomId],
    queryFn: () => fetchFromApi("booking/room/" + roomId),
  });

  const now = Date.now();
  const upcoming = (bookings ?? [])
    .filter((b) => new Date(b.endTime).getTime() > now)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  return (
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
            {upcoming.length} {upcoming.length === 1 ? "bokning" : "bokningar"}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
          Ett fel uppstod: {error.message}
        </p>
      )}

      {upcoming && upcoming.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-gray-500">
          <CalendarX2 className="w-8 h-8 text-gray-300" />
          <p className="text-sm">Inga bokningar för det här rummet ännu.</p>
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
  );
};

export default RoomBookingDetails;
