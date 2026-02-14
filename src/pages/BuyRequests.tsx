import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuyRequests() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Buy Requests</h1>
      <p className="text-muted-foreground">View and manage property purchase requests.</p>
      <Card><CardHeader><CardTitle>Your Requests</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">No buy requests yet.</p></CardContent></Card>
    </div>
  );
}
