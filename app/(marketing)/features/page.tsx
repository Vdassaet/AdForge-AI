import { 
  Wand2, 
  Image as ImageIcon, 
  Megaphone, 
  Share2, 
  Users, 
  LineChart, 
  Lightbulb, 
  CreditCard 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Wand2,
    title: "AI Ad Generation",
    description: "Generate highly converting ad copy tailored to local contractor services. The AI understands your industry and writes compelling text that speaks to homeowners.",
  },
  {
    icon: ImageIcon,
    title: "Creative Studio",
    description: "Access and manage high-quality ad creatives. Quickly assemble the visual assets you need to make your ads stand out in the feed.",
  },
  {
    icon: Megaphone,
    title: "Campaign Management",
    description: "Launch and monitor ad campaigns directly from your dashboard. Easily set daily budgets and target locations without logging into complex ad managers.",
  },
  {
    icon: Share2,
    title: "Seamless Meta Connection",
    description: "Connect securely to your Meta (Facebook/Instagram) Business account. We sync your campaigns and leads automatically.",
  },
  {
    icon: Users,
    title: "Integrated CRM",
    description: "Capture leads instantly. New inquiries from your ads flow directly into a pipeline where you can track statuses from 'New' to 'Won'.",
  },
  {
    icon: LineChart,
    title: "Actionable Analytics",
    description: "Track the metrics that actually matter to your bottom line: Cost per Lead, Total Spend, and active campaigns in real-time.",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description: "Receive AI-powered insights on how to improve campaign performance, optimize budgets, or refresh ad creatives.",
  },
  {
    icon: CreditCard,
    title: "Simple Billing",
    description: "Manage your subscription securely. Upgrade as your business grows and cancel easily at any time.",
  }
];

export default function FeaturesPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">The Complete Toolkit for Contractors</h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          We built Contractor AI Ads by mapping the entire journey from idea to booked job. 
          Here is how the platform empowers your business at every step.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="bg-slate-50 border border-slate-100 p-8 rounded-2xl hover:border-blue-200 transition">
              <div className="size-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-24 text-center bg-blue-600 rounded-3xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to streamline your advertising?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
          Join contractors who are saving time and reaching more local customers with our AI-powered platform.
        </p>
        <Button asChild size="lg" variant="secondary" className="text-blue-900 font-bold px-8">
          <Link href="/signup">Start Free Today</Link>
        </Button>
      </div>
    </div>
  );
}
