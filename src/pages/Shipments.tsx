import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Shipments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shipments</h1>
      <p className="text-muted-foreground">Track shipments and deliveries.</p>
      <Card><CardHeader><CardTitle>Shipment Tracking</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">No shipments yet.</p></CardContent></Card>
    </div>
  );
}
