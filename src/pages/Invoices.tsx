import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Invoices() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoices</h1>
      <p className="text-muted-foreground">Track and manage invoices.</p>
      <Card><CardHeader><CardTitle>Invoice Summary</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-sm">No invoices yet.</p></CardContent></Card>
    </div>
  );
}
