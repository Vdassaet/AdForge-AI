"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-primary/10 p-6 rounded-full mb-2">
        <Briefcase className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Your Services
      </h1>
      <p className="text-lg text-muted-foreground">
        Manage the services you offer.
      </p>
      <Link 
        href="/business" 
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-bold rounded-xl shadow-sm hover:bg-secondary/80 transition-all"
      >
        Go back to Business Profile
      </Link>
    </div>
  );
}
