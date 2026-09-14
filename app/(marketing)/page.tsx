import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            AI Advertising for Local Contractors
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create better ads, reach local customers, and manage your campaigns with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg h-14 px-8">
              <Link href="/signup">
                Start Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg h-14 px-8 border-slate-300 text-slate-700 hover:bg-slate-50">
              <Link href="/features">See How It Works</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            No credit card required. Free 14-day trial on paid plans.
          </p>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to grow your business</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From creative generation to lead management, Contractor AI Ads streamlines the entire advertising journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="size-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered Campaigns</h3>
              <p className="text-slate-600">
                Generate highly targeted ad copy and creatives tailored for your specific service areas and local audience.
              </p>
            </div>
            <div className="text-center">
              <div className="size-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Seamless Lead CRM</h3>
              <p className="text-slate-600">
                All your leads from Meta and website forms flow directly into one easy-to-use pipeline.
              </p>
            </div>
            <div className="text-center">
              <div className="size-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Actionable Analytics</h3>
              <p className="text-slate-600">
                Track your actual cost per lead, ad spend, and conversion metrics in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 bg-slate-50 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Honest Marketing, Real Tools</h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <p className="text-slate-700">No fake promises or &ldquo;guaranteed leads&rdquo;. We provide the tools, you build the success.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <p className="text-slate-700">Full ownership of your ad accounts. We integrate seamlessly with your existing Meta Business Manager.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <p className="text-slate-700">Transparent pricing. No hidden fees or unexpected agency markups on your ad spend.</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
              <p className="text-slate-700">Cancel anytime. We believe in earning your business every single month.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
