import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  C
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Contractor AI</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-slate-600">
              <Link href="/features" className="hover:text-blue-600 transition">Features</Link>
              <Link href="/pricing" className="hover:text-blue-600 transition">Pricing</Link>
              <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-blue-600 transition">
                Sign In
              </Link>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/signup">Start Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                C
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Contractor AI</span>
            </div>
            <p className="text-sm text-slate-500">
              Create better ads, reach local customers, and manage your campaigns with AI.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/features" className="hover:text-blue-600">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Contractor AI Ads. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 mt-2 md:mt-0 max-w-md text-right">
            Disclaimer: We do not guarantee leads or revenue. Results vary by market, industry, and budget. Not affiliated with or endorsed by Meta.
          </p>
        </div>
      </footer>
    </div>
  );
}
