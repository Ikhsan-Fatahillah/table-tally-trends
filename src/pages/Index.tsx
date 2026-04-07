import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Armchair, TrendingUp, XCircle } from "lucide-react";
import SeatUtilization from "@/components/analytics/SeatUtilization";
import ReservationTrends from "@/components/analytics/ReservationTrends";
import CancellationRate from "@/components/analytics/CancellationRate";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Restaurant Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Reservation insights & performance metrics</p>
        </div>

        <Tabs defaultValue="seats" className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="seats" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Armchair className="h-4 w-4" />
              Seat Utilization
            </TabsTrigger>
            <TabsTrigger value="trends" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
              Reservation Trends
            </TabsTrigger>
            <TabsTrigger value="cancellations" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <XCircle className="h-4 w-4" />
              Cancellation Rate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seats">
            <SeatUtilization />
          </TabsContent>
          <TabsContent value="trends">
            <ReservationTrends />
          </TabsContent>
          <TabsContent value="cancellations">
            <CancellationRate />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
