"use client";

import Link from "next/link";
import { User, Building, CreditCard, Facebook, Bell, Users, Shield, Sliders } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    {
      title: "Account & Business",
      items: [
        { name: "Account Details", href: "#", icon: User, desc: "Manage your personal information and password." },
        { name: "Business Profile", href: "/business", icon: Building, desc: "Update your business information and assets." },
        { name: "Team Members", href: "#", icon: Users, desc: "Invite your team to collaborate." },
      ]
    },
    {
      title: "Integrations & Billing",
      items: [
        { name: "Facebook & Instagram", href: "/integrations/meta", icon: Facebook, desc: "Connect your ad accounts and pages." },
        { name: "Billing & Plans", href: "/billing", icon: CreditCard, desc: "Manage your subscription and payment methods." },
        { name: "Notifications", href: "/notifications", icon: Bell, desc: "Configure how you want to be alerted." },
      ]
    },
    {
      title: "Advanced",
      items: [
        { name: "Security", href: "#", icon: Shield, desc: "Two-factor authentication and security settings." },
        { name: "Advanced Settings", href: "#", icon: Sliders, desc: "Technical configurations and developer options." },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and advanced configurations.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <Link key={item.name} href={item.href} className="bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-start gap-4 group">
                  <div className="bg-muted p-3 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
