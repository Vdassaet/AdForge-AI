"use client";

import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";
import { Plus, CheckCircle2, Wrench, Shield, Hammer } from "lucide-react";
import { toast } from "sonner";

export default function ServicesPage() {
  const services = demoStore.getServices();

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "Railings":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "Fencing":
        return <Hammer className="w-4 h-4 text-emerald-600" />;
      case "Repairs":
        return <Wrench className="w-4 h-4 text-amber-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-5xl space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Services Offered</h1>
            <SimulatedBadge variant="outline" label="Demo Catalog" />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Configure the core services advertised in your campaigns for NJ Fence and Railing.
          </p>
        </div>
        <button
          onClick={() => toast.info("Simulated: Adding a new service")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    {getServiceIcon(service.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{service.name}</h3>
                    <span className="text-[11px] text-slate-400">{service.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                  <SimulatedBadge variant="subtle" />
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Starting Price</span>
                <span className="font-mono font-bold text-slate-900">{service.startingPrice}</span>
              </div>

              <button
                onClick={() => toast.info(`Editing service: ${service.name}`)}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs"
              >
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
