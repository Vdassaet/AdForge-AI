import {
  Home,
  PlusCircle,
  Users,
  LineChart,
  Building,
  Settings,
} from "lucide-react";

export const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Create Ad", href: "/campaigns/new", icon: PlusCircle },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Results", href: "/analytics", icon: LineChart },
  { name: "Business", href: "/business", icon: Building },
  { name: "Settings", href: "/settings", icon: Settings },
];
