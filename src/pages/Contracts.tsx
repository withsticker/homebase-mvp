import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Contracts() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contracts</h1>
      <p className="text-muted-foreground">Manage your contracts and agreements.</p>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Contract Summary</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground text-sm">No contracts yet. Create your first contract to get started.</p></CardContent>
      </Card>
    </div>
  );
}
