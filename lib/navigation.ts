import {
  LayoutDashboard,
  Building,
  Briefcase,
  Image as ImageIcon,
  Wand2,
  Megaphone,
  Users,
  LineChart,
  Lightbulb,
  Plug,
  CreditCard,
  Settings,
  Beaker,
  ClipboardList,
  Phone,
  MapPin,
  Share2,
  Bell,
  Sliders
} from "lucide-react";

export const navigation = [
  { heading: "Overview" },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", href: "/analytics", icon: LineChart },
  
  { heading: "Campaigns" },
  { name: "AI Ad Generator", href: "/ai-ad-generator", icon: Wand2 },
  { name: "Ad Creatives", href: "/creatives", icon: ImageIcon },
  { name: "Campaigns", href: "/campaigns", icon: Megaphone },
  { name: "A/B Testing", href: "/experiments", icon: Beaker },

  { heading: "Lead Generation" },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Call Tracking", href: "/calls", icon: Phone },
  { name: "Website Forms", href: "/forms", icon: ClipboardList },

  { heading: "Business" },
  { name: "Business Profile", href: "/business", icon: Building },
  { name: "Services", href: "/business/services", icon: Briefcase },
  { name: "Service Areas", href: "/business/service-areas", icon: MapPin },
  { name: "Assets", href: "/assets", icon: ImageIcon },

  { heading: "System" },
  { name: "AI Recommendations", href: "/recommendations", icon: Lightbulb },
  { name: "Meta Integration", href: "/integrations/meta", icon: Share2 },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Plan Limits (Admin)", href: "/settings/plan-limits", icon: Sliders },
];
