import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const COLORS = ["hsl(217, 91%, 60%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(270, 70%, 60%)", "hsl(180, 70%, 40%)"];

export default function Analytics() {
  const { user } = useAuth();
  const [leadsByStatus, setLeadsByStatus] = useState<any[]>([]);
  const [propertiesByStatus, setPropertiesByStatus] = useState<any[]>([]);
  const [leadsBySource, setLeadsBySource] = useState<any[]>([]);
  const [tasksByPriority, setTasksByPriority] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [contacts, properties, tasks] = await Promise.all([
        supabase.from("contacts").select("status, source").eq("user_id", user.id),
        supabase.from("properties").select("status").eq("user_id", user.id),
        supabase.from("tasks").select("priority, status").eq("user_id", user.id),
      ]);

      // Leads by status
      const statusCounts: Record<string, number> = {};
      (contacts.data ?? []).forEach((c: any) => { statusCounts[c.status] = (statusCounts[c.status] || 0) + 1; });
      setLeadsByStatus(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

      // Leads by source
      const sourceCounts: Record<string, number> = {};
      (contacts.data ?? []).forEach((c: any) => { const s = c.source || "Unknown"; sourceCounts[s] = (sourceCounts[s] || 0) + 1; });
      setLeadsBySource(Object.entries(sourceCounts).map(([name, value]) => ({ name, value })));

      // Properties by status
      const propCounts: Record<string, number> = {};
      (properties.data ?? []).forEach((p: any) => { propCounts[p.status] = (propCounts[p.status] || 0) + 1; });
      setPropertiesByStatus(Object.entries(propCounts).map(([name, value]) => ({ name: name.replace("_", " "), value })));

      // Tasks by priority
      const taskCounts: Record<string, number> = {};
      (tasks.data ?? []).forEach((t: any) => { taskCounts[t.priority] = (taskCounts[t.priority] || 0) + 1; });
      setTasksByPriority(Object.entries(taskCounts).map(([name, value]) => ({ name, value })));
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Insights into your CRM data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Leads by Status</CardTitle></CardHeader>
          <CardContent>
            {leadsByStatus.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={leadsByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {leadsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Leads by Source</CardTitle></CardHeader>
          <CardContent>
            {leadsBySource.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={leadsBySource}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Properties by Status</CardTitle></CardHeader>
          <CardContent>
            {propertiesByStatus.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={propertiesByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tasks by Priority</CardTitle></CardHeader>
          <CardContent>
            {tasksByPriority.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={tasksByPriority} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {tasksByPriority.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
