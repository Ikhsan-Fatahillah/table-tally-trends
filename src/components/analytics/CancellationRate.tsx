import { Reservation } from "@/data/mockReservations";
import StatCard from "./StatCard";
import { XCircle, Percent } from "lucide-react";

interface Props {
  data: Reservation[];
}

const CancellationRate = ({ data }: Props) => {
  const total = data.length;
  const totalCancelled = data.filter((r) => r.status === "cancelled").length;
  const rate = total > 0 ? ((totalCancelled / total) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
      <StatCard title="Total Cancellations" value={totalCancelled} subtitle={`out of ${total}`} icon={XCircle} />
      <StatCard title="Cancellation Rate" value={`${rate}%`} icon={Percent} />
    </div>
  );
};

export default CancellationRate;
