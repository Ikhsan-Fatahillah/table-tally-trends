import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import SeatUtilization from "@/components/analytics/SeatUtilization";
import ReservationTrends from "@/components/analytics/ReservationTrends";
import CancellationRate from "@/components/analytics/CancellationRate";
import { reservations } from "@/data/mockReservations";

const Index = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date("2025-03-01"));
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date("2025-04-07"));

  const filtered = reservations.filter((r) => {
    const d = new Date(r.date);
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground"><h1 className="text-2xl font-bold text-foreground">Daily Analytics</h1></h1>
            <p className="text-sm text-muted-foreground mt-1">Reservation insights & performance metrics</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <span className="text-muted-foreground text-sm">–</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {dateTo ? format(dateTo, "MMM dd, yyyy") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Seat Utilization</h2>
            <SeatUtilization data={filtered} />
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Reservation Trends</h2>
            <ReservationTrends data={filtered} />
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Cancellation Rate</h2>
            <CancellationRate data={filtered} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
