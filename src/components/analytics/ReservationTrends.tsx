import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservations } from "@/data/mockReservations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import StatCard from "./StatCard";
import { CalendarDays, Users, Clock, TrendingUp } from "lucide-react";

const ReservationTrends = () => {
  const all = reservations;
  const confirmed = all.filter((r) => r.status === "confirmed");

  const totalReservations = all.length;
  const totalGuests = all.reduce((sum, r) => sum + r.guests, 0);
  const avgGuests = (totalGuests / all.length).toFixed(1);

  // Peak hour
  const hourCounts: Record<number, number> = {};
  confirmed.forEach((r) => {
    const h = parseInt(r.startTime);
    hourCounts[h] = (hourCounts[h] || 0) + 1;
  });
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];

  // Daily trend
  const dailyMap: Record<string, number> = {};
  all.forEach((r) => {
    dailyMap[r.date] = (dailyMap[r.date] || 0) + 1;
  });
  const dailyData = Object.entries(dailyMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  // Booking time distribution
  const bookingHourData = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    const label = `${String(hour).padStart(2, "0")}:00`;
    const count = all.filter((r) => new Date(r.bookedAt).getHours() === hour).length;
    return { hour: label, bookings: count };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Reservations" value={totalReservations} icon={CalendarDays} />
        <StatCard title="Total Guests" value={totalGuests} icon={Users} />
        <StatCard title="Avg Guests/Booking" value={avgGuests} icon={TrendingUp} />
        <StatCard title="Peak Hour" value={`${peakHour[0]}:00`} subtitle={`${peakHour[1]} bookings`} icon={Clock} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Reservation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} interval={3} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
