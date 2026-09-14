"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name?: string;
  href?: string;
  icon?: React.ElementType;
  heading?: string;
}

export function MobileNav({ navigation }: { navigation: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="p-2 -ml-2 mr-2 rounded-md hover:bg-muted"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 flex w-72 flex-col bg-background p-6 shadow-lg border-r">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center mb-8">
              <span className="font-bold text-xl tracking-tight">Contractor AI</span>
            </div>
            <nav className="flex flex-col gap-2 overflow-y-auto">
              {navigation.map((item, index) => {
                if (item.heading) {
                  return (
                    <div key={index} className="mt-4 mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.heading}
                    </div>
                  );
                }
                const Icon = item.icon;
                const isActive = item.href && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
                return (
                  <Link
                    key={item.name}
                    href={item.href || "#"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
