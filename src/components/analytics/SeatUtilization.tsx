import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservations, seatAvailability, SeatType } from "@/data/mockReservations";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SeatUtilization = () => {
  const confirmed = reservations.filter((r) => r.status === "confirmed");

  // Utilization by seat type
  const seatTypes: SeatType[] = ["Counter", "Table", "Private Room"];
  const seatData = seatTypes.map((type) => {
    const reservationsForType = confirmed.filter((r) => r.seatType === type);
    const totalAvailable = seatAvailability[type];
    // Unique date-hour slots used
    const slots = new Set(reservationsForType.map((r) => `${r.date}-${r.startTime}`));
    // Total possible slots (days * hours 11-22 * tables)
    const uniqueDays = new Set(confirmed.map((r) => r.date)).size;
    const totalSlots = uniqueDays * 12 * totalAvailable;
    const rate = totalSlots > 0 ? Math.round((slots.size / totalSlots) * 100) : 0;

    return {
      type,
      totalAvailable,
      tablesUsed: reservationsForType.length,
      utilization: rate,
    };
  });

  // Hourly utilization
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 11;
    const label = `${String(hour).padStart(2, "0")}:00`;
    const count = confirmed.filter((r) => parseInt(r.startTime) === hour).length;
    return { hour: label, reservations: count };
  });

  const colors = ["hsl(217, 91%, 60%)", "hsl(199, 89%, 48%)", "hsl(210, 40%, 75%)"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {seatData.map((s, i) => (
          <Card key={s.type}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{s.type}</p>
              <p className="text-3xl font-bold mt-1" style={{ color: colors[i] }}>
                {s.utilization}%
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {s.totalAvailable} tables available · {s.tablesUsed} reservations
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hourly Reservation Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="hour" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip />
              <Bar dataKey="reservations" radius={[6, 6, 0, 0]}>
                {hourlyData.map((_, i) => (
                  <Cell key={i} fill="hsl(217, 91%, 60%)" fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeatUtilization;
