import {
  LayoutDashboard, Users, Home, CheckSquare, BarChart3,
  FileText, ShoppingBag, Truck, Link2, Settings
} from "lucide-react";
import type { AppRole } from "@/hooks/useAuth";

export interface NavItem {
  title: string;
  url: string;
  icon: any;
}

const allNav: Record<string, NavItem> = {
  dashboard: { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  leads: { title: "Leads & Contacts", url: "/leads", icon: Users },
  properties: { title: "Properties", url: "/properties", icon: Home },
  tasks: { title: "Tasks", url: "/tasks", icon: CheckSquare },
  analytics: { title: "Analytics", url: "/analytics", icon: BarChart3 },
  contracts: { title: "Contracts", url: "/contracts", icon: FileText },
  buyRequests: { title: "Buy Requests", url: "/buy-requests", icon: ShoppingBag },
  invoices: { title: "Invoices", url: "/invoices", icon: FileText },
  shipments: { title: "Shipments", url: "/shipments", icon: Truck },
  referrals: { title: "Referrals", url: "/referrals", icon: Link2 },
  settings: { title: "Settings", url: "/settings", icon: Settings },
};

const pick = (...keys: string[]) => keys.map(k => allNav[k]);

export const roleNavMap: Record<AppRole, NavItem[]> = {
  admin: pick("dashboard", "leads", "properties", "tasks", "analytics", "contracts", "invoices", "settings"),
  broker: pick("dashboard", "properties", "leads", "contracts", "tasks", "analytics"),
  client: pick("dashboard", "properties", "buyRequests", "invoices", "tasks"),
  sales_agent: pick("dashboard", "leads", "properties", "tasks", "analytics"),
  supplier: pick("dashboard", "properties", "invoices", "shipments"),
  affiliate: pick("dashboard", "referrals", "analytics"),
  // Legacy roles
  agent: pick("dashboard", "leads", "properties", "tasks", "analytics"),
  user: pick("dashboard", "properties", "tasks"),
};
