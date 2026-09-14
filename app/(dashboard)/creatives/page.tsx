import { CreativeShowcase } from "@/components/creatives/creative-showcase";

export default function CreativesPage() {
  return (
    <div className="h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Creative Studio & Ad Library</h1>
        <p className="mt-1 text-sm text-slate-500">
          Explore ready-to-launch visual ad creatives tailored for NJ Fence and Railing or design custom multi-format ads.
        </p>
      </div>

      <CreativeShowcase />
    </div>
  );
}

