import { ExperimentList } from "@/components/experiments/experiment-list";

export default function ExperimentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">A/B Testing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Compare ad variations to see what resonates best with your audience. 
          Use statistically significant data to optimize your cost per lead.
        </p>
      </div>
      
      <ExperimentList />
    </div>
  );
}
