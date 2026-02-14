import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, LayoutGrid, List, Home, DollarSign, Maximize } from "lucide-react";
import { toast } from "sonner";

type Property = {
  id: string;
  title: string;
  address: string;
  price: number | null;
  property_type: "residential" | "commercial" | "rental";
  status: "available" | "under_contract" | "sold" | "rented";
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  description: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  under_contract: "bg-yellow-100 text-yellow-800",
  sold: "bg-blue-100 text-blue-800",
  rented: "bg-purple-100 text-purple-800",
};

const emptyProperty = { title: "", address: "", price: "", property_type: "residential" as const, status: "available" as const, bedrooms: "", bathrooms: "", area_sqft: "", description: "" };

export default function Properties() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyProperty);

  const fetchProperties = async () => {
    if (!user) return;
    const { data } = await supabase.from("properties").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setProperties((data as Property[]) ?? []);
  };

  useEffect(() => { fetchProperties(); }, [user]);

  const handleSave = async () => {
    if (!user || !form.title.trim() || !form.address.trim()) { toast.error("Title and address are required"); return; }

    const payload = {
      title: form.title, address: form.address, price: form.price ? parseFloat(form.price) : null,
      property_type: form.property_type, status: form.status, bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null, area_sqft: form.area_sqft ? parseFloat(form.area_sqft) : null,
      description: form.description || null,
    };

    if (editing) {
      const { error } = await supabase.from("properties").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Property updated");
    } else {
      const { error } = await supabase.from("properties").insert({ ...payload, user_id: user.id });
      if (error) { toast.error(error.message); return; }
      await supabase.from("activities").insert({ user_id: user.id, action: "Created", entity_type: "Property", metadata: { title: form.title } });
      toast.success("Property added");
    }
    setOpen(false); setEditing(null); setForm(emptyProperty); fetchProperties();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    toast.success("Property deleted"); fetchProperties();
  };

  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({ title: p.title, address: p.address, price: p.price?.toString() ?? "", property_type: p.property_type as typeof emptyProperty.property_type, status: p.status as typeof emptyProperty.status, bedrooms: p.bedrooms?.toString() ?? "", bathrooms: p.bathrooms?.toString() ?? "", area_sqft: p.area_sqft?.toString() ?? "", description: p.description ?? "" });
    setOpen(true);
  };

  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || p.property_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); setForm(emptyProperty); } }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Property</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Property" : "Add Property"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Address *</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.property_type} onValueChange={(v: any) => setForm({ ...form, property_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="rental">Rental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Beds</Label><Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} /></div>
                <div><Label>Baths</Label><Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} /></div>
                <div><Label>Area (sqft)</Label><Input type="number" value={form.area_sqft} onChange={(e) => setForm({ ...form, area_sqft: e.target.value })} /></div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="under_contract">Under Contract</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <Button onClick={handleSave} className="w-full">{editing ? "Update" : "Add"} Property</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search properties..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="rental">Rental</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><LayoutGrid className="h-4 w-4" /></Button>
          <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No properties found</CardContent></Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Card key={p.id} className="group">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{p.title}</CardTitle>
                  <Badge className={statusColors[p.status]}>{p.status.replace("_", " ")}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{p.address}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  {p.price && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{p.price.toLocaleString()}</span>}
                  {p.bedrooms != null && <span>{p.bedrooms} bed</span>}
                  {p.bathrooms != null && <span>{p.bathrooms} bath</span>}
                  {p.area_sqft != null && <span className="flex items-center gap-1"><Maximize className="h-3 w-3" />{p.area_sqft} sqft</span>}
                </div>
                <div className="flex gap-1">
                  <Badge variant="outline">{p.property_type}</Badge>
                  <div className="ml-auto flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-3">Title</th><th className="text-left p-3">Address</th><th className="text-left p-3">Price</th><th className="text-left p-3">Type</th><th className="text-left p-3">Status</th><th className="p-3 w-20">Actions</th></tr></thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3">{p.address}</td>
                    <td className="p-3">{p.price ? `$${p.price.toLocaleString()}` : "-"}</td>
                    <td className="p-3"><Badge variant="outline">{p.property_type}</Badge></td>
                    <td className="p-3"><Badge className={statusColors[p.status]}>{p.status.replace("_", " ")}</Badge></td>
                    <td className="p-3"><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
