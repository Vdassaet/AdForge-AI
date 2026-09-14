"use client";

import { User } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <MobileNav navigation={navigation} />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <NotificationDropdown />

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

          <Button variant="ghost" size="icon" className="rounded-full bg-muted border overflow-hidden">
            <User className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
