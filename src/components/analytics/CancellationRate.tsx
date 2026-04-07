import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reservations } from "@/data/mockReservations";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import StatCard from "./StatCard";
import { XCircle, Percent, Clock } from "lucide-react";

const CancellationRate = () => {
  const total = reservations.length;
  const cancelled = reservations.filter((r) => r.status === "cancelled");
  const totalCancelled = cancelled.length;
  const rate = ((totalCancelled / total) * 100).toFixed(1);

  // Average cancellation lead time (hours before reservation)
  const leadTimes = cancelled
    .filter((r) => r.cancelledAt)
    .map((r) => {
      const resTime = new Date(`${r.date}T${r.startTime}`).getTime();
      const cancelTime = new Date(r.cancelledAt!).getTime();
      return Math.max(0, (resTime - cancelTime) / (1000 * 60 * 60));
    });
  const avgLeadTime = leadTimes.length > 0 ? (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1) : "0";

  // Cancellation by timing category
  const lastMinute = leadTimes.filter((h) => h < 2).length;
  const sameDay = leadTimes.filter((h) => h >= 2 && h < 24).length;
  const earlyCancel = leadTimes.filter((h) => h >= 24).length;

  const timingData = [
    { name: "Last Minute (<2h)", value: lastMinute },
    { name: "Same Day (2-24h)", value: sameDay },
    { name: "Early (>24h)", value: earlyCancel },
  ];

  // Cancellation by time slot
  const lunchCancels = cancelled.filter((r) => parseInt(r.startTime) < 15).length;
  const dinnerCancels = cancelled.filter((r) => parseInt(r.startTime) >= 15).length;
  const slotData = [
    { slot: "Lunch (11-15)", cancellations: lunchCancels },
    { slot: "Dinner (15-23)", cancellations: dinnerCancels },
  ];

  const pieData = [
    { name: "Confirmed", value: total - totalCancelled },
    { name: "Cancelled", value: totalCancelled },
  ];
  const pieColors = ["hsl(217, 91%, 60%)", "hsl(0, 84%, 60%)"];
  const timingColors = ["hsl(0, 84%, 60%)", "hsl(35, 92%, 55%)", "hsl(142, 71%, 45%)"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Cancellations" value={totalCancelled} subtitle={`out of ${total}`} icon={XCircle} />
        <StatCard title="Cancellation Rate" value={`${rate}%`} icon={Percent} />
        <StatCard title="Avg Lead Time" value={`${avgLeadTime}h`} subtitle="before reservation" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confirmed vs Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cancellation Timing</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timingData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis type="number" fontSize={12} tickLine={false} />
                <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} width={120} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {timingData.map((_, i) => (
                    <Cell key={i} fill={timingColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cancellations by Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {slotData.map((s) => (
              <div key={s.slot} className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">{s.slot}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.cancellations}</p>
                <p className="text-xs text-muted-foreground">cancellations</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancellationRate;
