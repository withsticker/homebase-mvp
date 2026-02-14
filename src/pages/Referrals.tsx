import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Referrals() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Referrals</h1>
      <p className="text-muted-foreground">Track your affiliate referrals and commissions.</p>
      <Card><CardHeader><CardTitle>Referral Overview</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">No referrals yet.</p></CardContent></Card>
    </div>
  );
}
