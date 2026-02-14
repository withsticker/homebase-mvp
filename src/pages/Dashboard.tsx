import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Home, CheckSquare, Trophy, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ leads: 0, properties: 0, tasks: 0, won: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [leads, properties, tasks, won] = await Promise.all([
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("tasks").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "won"),
      ]);
      setStats({
        leads: leads.count ?? 0,
        properties: properties.count ?? 0,
        tasks: tasks.count ?? 0,
        won: won.count ?? 0,
      });
    };

    const fetchActivities = async () => {
      const { data } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentActivities(data ?? []);
    };

    fetchStats();
    fetchActivities();
  }, [user]);

  const cards = [
    { label: "Total Leads", value: stats.leads, icon: Users, color: "text-primary" },
    { label: "Active Listings", value: stats.properties, icon: Home, color: "text-success" },
    { label: "Pending Tasks", value: stats.tasks, icon: CheckSquare, color: "text-warning" },
    { label: "Deals Won", value: stats.won, icon: Trophy, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/leads")}><Plus className="h-4 w-4 mr-1" />Add Lead</Button>
          <Button size="sm" variant="outline" onClick={() => navigate("/properties")}><Plus className="h-4 w-4 mr-1" />Add Property</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity. Start by adding leads or properties!</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((a) => (
                <div key={a.id} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>{a.action} - {a.entity_type}</span>
                  <span className="ml-auto text-muted-foreground text-xs">
                    {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
