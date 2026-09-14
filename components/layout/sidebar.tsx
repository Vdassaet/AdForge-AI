"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <div className="flex h-16 shrink-0 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            C
          </div>
          <span className="text-lg font-bold tracking-tight">Contractor AI</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item, index) => {
            if (item.heading || !item.href) {
              return (
                <div key={index} className="mt-6 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {item.heading}
                </div>
              );
            }
            
            const Icon = item.icon;
            const href = item.href;
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            
            return (
              <Link
                key={item.name}
                href={href || "#"}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {Icon && <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
