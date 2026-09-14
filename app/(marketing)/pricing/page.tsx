import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for exploring the platform and testing AI features.",
    features: [
      "10 AI generations per month",
      "5 ad creatives per month",
      "1 active campaign",
      "1 connected ad account",
      "Basic lead tracking (up to 50)",
    ],
    cta: "Start Free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Great for solo contractors managing a single business.",
    features: [
      "100 AI generations per month",
      "50 ad creatives per month",
      "5 active campaigns",
      "2 connected ad accounts",
      "Unlimited lead tracking",
      "Standard support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    featured: true,
  },
  {
    name: "Pro",
    price: "$149",
    period: "/month",
    description: "For growing businesses running multiple campaigns.",
    features: [
      "500 AI generations per month",
      "250 ad creatives per month",
      "25 active campaigns",
      "5 connected ad accounts",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Get Started",
    href: "/signup",
    featured: false,
  },
  {
    name: "Agency",
    price: "$499",
    period: "/month",
    description: "For marketing agencies managing multiple clients.",
    features: [
      "Unlimited AI generations",
      "Unlimited ad creatives",
      "Unlimited active campaigns",
      "Unlimited connected ad accounts",
      "White-label reporting",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
];

const faqs = [
  {
    question: "Do you guarantee leads or revenue?",
    answer: "No. Advertising results depend on many factors including your market, competition, service quality, and budget. Our platform provides the tools to create, manage, and optimize your ads effectively using AI, but we cannot guarantee specific financial outcomes or lead volumes."
  },
  {
    question: "Do I pay for ad spend through your platform?",
    answer: "No. You pay Meta (Facebook/Instagram) directly for your ad spend. Our subscription fee covers the use of our software, AI generation, and CRM tools."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your billing dashboard. There are no long-term contracts or cancellation fees."
  },
  {
    question: "Do I need technical skills to use this?",
    answer: "No. Contractor AI Ads is designed specifically for local contractors. The AI handles the complex copywriting and creative generation, making it easy to launch professional campaigns."
  }
];

export default function PricingPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Choose the plan that fits your business. Upgrade, downgrade, or cancel at any time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`rounded-2xl p-8 flex flex-col border ${
              plan.featured 
                ? "border-blue-600 shadow-lg relative bg-white" 
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1">{plan.description}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
              {plan.period && <span className="text-slate-500">{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <Check className="h-5 w-5 text-blue-600 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              asChild 
              variant={plan.featured ? "default" : "outline"} 
              className={`w-full mt-auto ${plan.featured ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            >
              <Link href={plan.href}>{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <div key={i}>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
              <p className="text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
