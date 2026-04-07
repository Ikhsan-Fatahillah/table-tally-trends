import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation } from "@/data/mockReservations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import StatCard from "./StatCard";
import { CalendarDays, Users, Clock, TrendingUp } from "lucide-react";

interface Props {
  data: Reservation[];
}

const ReservationTrends = ({ data }: Props) => {
  const confirmed = data.filter((r) => r.status === "confirmed");

  const totalReservations = data.length;
  const totalGuests = data.reduce((sum, r) => sum + r.guests, 0);
  const avgGuests = data.length > 0 ? (totalGuests / data.length).toFixed(1) : "0";

  // Peak hour
  const hourCounts: Record<number, number> = {};
  confirmed.forEach((r) => {
    const h = parseInt(r.startTime);
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

  // Booking time distribution
  const bookingHourData = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    const label = `${String(hour).padStart(2, "0")}:00`;
    const count = data.filter((r) => new Date(r.bookedAt).getHours() === hour).length;
    return { hour: label, bookings: count };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Reservations" value={totalReservations} icon={CalendarDays} />
        <StatCard title="Total Guests" value={totalGuests} icon={Users} />
        <StatCard title="Avg Guests/Booking" value={avgGuests} icon={TrendingUp} />
        <StatCard title="Peak Hour" value={peakHour ? `${peakHour[0]}:00` : "-"} subtitle={peakHour ? `${peakHour[1]} bookings` : ""} icon={Clock} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Time Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="hour" fontSize={11} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip />
              <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                {bookingHourData.map((_, i) => (
                  <Cell key={i} fill="hsl(199, 89%, 48%)" fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationTrends;
