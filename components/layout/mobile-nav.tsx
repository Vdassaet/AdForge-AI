"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, PlusCircle, Users, LineChart, Menu } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Create", href: "/campaigns/new", icon: PlusCircle },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Results", href: "/analytics", icon: LineChart },
    { name: "More", href: "/settings", icon: Menu },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
