import { Card, CardContent } from "@/components/ui/card";
import { Reservation, seatAvailability, SeatType } from "@/data/mockReservations";

interface Props {
  data: Reservation[];
}

const SeatUtilization = ({ data }: Props) => {
  const confirmed = data.filter((r) => r.status === "confirmed");
  const seatTypes: SeatType[] = ["Counter", "Table", "Private Room"];

  const seatData = seatTypes.map((type) => {
    const reservationsForType = confirmed.filter((r) => r.seatType === type);
    const totalAvailable = seatAvailability[type];
    const slots = new Set(reservationsForType.map((r) => `${r.date}-${r.startTime}`));
    const uniqueDays = new Set(confirmed.map((r) => r.date)).size;
    const totalSlots = uniqueDays * 12 * totalAvailable;
    const rate = totalSlots > 0 ? Math.round((slots.size / totalSlots) * 100) : 0;

    return { type, totalAvailable, tablesUsed: reservationsForType.length, utilization: rate };
  });

  const colors = ["hsl(217, 91%, 60%)", "hsl(199, 89%, 48%)", "hsl(210, 40%, 75%)"];

  return (
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
  );
};

export default SeatUtilization;
