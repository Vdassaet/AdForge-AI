import Link from "next/link";
import { Building, Users, Sliders, ArrowRight } from "lucide-react";

export default function SettingsIndexPage() {
  const sections = [
    {
      title: "Organization Settings",
      description: "Manage company information, contact details, and brand identity.",
      href: "/settings/organization",
      icon: Building,
    },
    {
      title: "Team Management",
      description: "Invite team members, assign RBAC permissions, and manage access.",
      href: "/settings/team",
      icon: Users,
    },
    {
      title: "Plan Limits (Admin)",
      description: "Configure SaaS plan quotas, limits, and real-time usage rules.",
      href: "/settings/plan-limits",
      icon: Sliders,
      badge: "Admin",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your organization, team members, and system plan configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  {section.badge && (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase">
                      {section.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-base font-semibold text-slate-900 mb-1">
                  {section.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
