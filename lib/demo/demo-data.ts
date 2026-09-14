/**
 * Centralized Demo Data for Contractor AI Ads
 *
 * Provides realistic contractor data for "NJ Fence and Railing"
 * allowing the entire SaaS application to function flawlessly without:
 * - Supabase production credentials
 * - Meta credentials
 * - Stripe credentials
 * - AI API credentials
 */

export interface DemoBusinessProfile {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  state: string;
  industry: string;
  serviceAreas: string[];
  isDemo: true;
}

export interface DemoService {
  id: string;
  name: string;
  startingPrice: string;
  description: string;
  category: "Railings" | "Fencing" | "Repairs" | "Fabrication";
  isActive: boolean;
  isDemo: true;
}

export interface DemoCampaign {
  id: string;
  name: string;
  service: string;
  objective: "Leads" | "Calls" | "Website Traffic";
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  dailyBudget: number;
  totalSpend: number;
  leadsCount: number;
  callsCount: number;
  cpl: number;
  ctr: string;
  impressions: number;
  clicks: number;
  location: string;
  startDate: string;
  isDemo: true;
}

export interface DemoLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  source: "Meta" | "Website" | "Phone";
  status: "new" | "contacted" | "qualified" | "estimate" | "won" | "lost";
  estimatedValue: number;
  location: string;
  notes: string;
  date: string;
  isDemo: true;
}

export interface DemoCreative {
  id: string;
  campaignName: string;
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
  aspectRatio: "1:1" | "4:5" | "9:16" | "16:9";
  imageUrl: string;
  performanceScore: number;
  isDemo: true;
}

export interface DemoRecommendation {
  id: string;
  title: string;
  explanation: string;
  evidence: string;
  confidence: number;
  action_type: "increase_budget" | "decrease_budget" | "pause_ad" | "change_creative" | "change_audience";
  action_payload: Record<string, unknown>;
  impact_metric: string;
  impact_value: string;
  status: "pending" | "applied" | "dismissed";
  isDemo: true;
}

export interface DemoAnalyticsSummary {
  summary: {
    totalSpend: number;
    totalLeads: number;
    averageCpl: number;
    totalCalls?: number;
    activeCampaigns?: number;
  };
  monthlyData: {
    month: string;
    spend: number;
    leads: number;
    cpl: number;
  }[];
  activeCampaigns: number;
  totalLeads: number;
  avgCpl: number;
  totalSpend: number;
  callsReceived: number;
  formLeads: number;
  conversionRate: number;
  impressions: number;
  clicks: number;
  isDemo: true;
}

/**
 * BASELINE DEMO DATASET
 * Tailored specifically to "NJ Fence and Railing"
 */
export const INITIAL_DEMO_DATA: {
  business: DemoBusinessProfile;
  services: DemoService[];
  campaigns: DemoCampaign[];
  leads: DemoLead[];
  creatives: DemoCreative[];
  recommendations: DemoRecommendation[];
  analytics: DemoAnalyticsSummary;
} = {
  business: {
    name: "NJ Fence and Railing",
    legalName: "NJ Fence and Railing LLC",
    tagline: "Northern New Jersey's Premier Fence & Custom Railing Specialists",
    description:
      "Full-service fencing and railing contractor with 15+ years experience. Specializing in durable aluminum railings, residential & commercial fence installations, historic railing repairs, and bespoke ornamental metal fabrication throughout Bergen, Passaic, Essex, and Morris counties.",
    phone: "(201) 555-0198",
    email: "info@njfence.com",
    website: "https://njfence.com",
    address: {
      street: "450 Industrial Way",
      city: "Paramus",
      state: "NJ",
      zip: "07652",
    },
    state: "NJ",
    industry: "Home Improvement & Construction",
    serviceAreas: [
      "Bergen County, NJ",
      "Passaic County, NJ",
      "Essex County, NJ",
      "Morris County, NJ",
      "Rockland County, NY",
    ],
    isDemo: true,
  },

  services: [
    {
      id: "demo_srv_1",
      name: "Aluminum Railing",
      startingPrice: "$85/linear ft",
      description:
        "Premium powder-coated aluminum railings for decks, porches, and stairs. 100% rust-free, low-maintenance, with lifetime structural warranty.",
      category: "Railings",
      isActive: true,
      isDemo: true,
    },
    {
      id: "demo_srv_2",
      name: "Fence Installation",
      startingPrice: "$32/linear ft",
      description:
        "Full residential & commercial fence installation including vinyl privacy, ornamental aluminum, and custom western red cedar wood.",
      category: "Fencing",
      isActive: true,
      isDemo: true,
    },
    {
      id: "demo_srv_3",
      name: "Railing Repair",
      startingPrice: "$250/project",
      description:
        "Expert railing repair, on-site mobile welding, loose post reinforcement, and code compliance restorations for homes and commercial complexes.",
      category: "Repairs",
      isActive: true,
      isDemo: true,
    },
    {
      id: "demo_srv_4",
      name: "Metal Fabrication",
      startingPrice: "$120/linear ft",
      description:
        "Custom ornamental iron, steel, and architectural metal fabrication for decorative gates, Juliette balconies, and custom railings.",
      category: "Fabrication",
      isActive: true,
      isDemo: true,
    },
  ],

  campaigns: [
    {
      id: "demo_camp_1",
      name: "Aluminum Railing",
      service: "Aluminum Railing",
      objective: "Leads",
      status: "ACTIVE",
      dailyBudget: 45,
      totalSpend: 890.0,
      leadsCount: 26,
      callsCount: 14,
      cpl: 34.23,
      ctr: "3.4%",
      impressions: 28400,
      clicks: 965,
      location: "Bergen & Passaic Counties, NJ",
      startDate: "2026-08-15",
      isDemo: true,
    },
    {
      id: "demo_camp_2",
      name: "Fence Installation",
      service: "Fence Installation",
      objective: "Leads",
      status: "ACTIVE",
      dailyBudget: 50,
      totalSpend: 1240.0,
      leadsCount: 42,
      callsCount: 22,
      cpl: 29.52,
      ctr: "2.9%",
      impressions: 41200,
      clicks: 1195,
      location: "Northern New Jersey (25-mile radius)",
      startDate: "2026-08-01",
      isDemo: true,
    },
    {
      id: "demo_camp_3",
      name: "Railing Repair",
      service: "Railing Repair",
      objective: "Calls",
      status: "ACTIVE",
      dailyBudget: 30,
      totalSpend: 510.0,
      leadsCount: 18,
      callsCount: 13,
      cpl: 28.33,
      ctr: "4.1%",
      impressions: 16800,
      clicks: 688,
      location: "Paramus, Ridgewood, Hackensack, Clifton, Montclair",
      startDate: "2026-08-20",
      isDemo: true,
    },
  ],

  leads: [
    {
      id: "demo_lead_1",
      name: "Sarah Jenkins",
      phone: "(201) 555-4821",
      email: "sjenkins.bergen@example.com",
      service: "Aluminum Railing",
      source: "Meta",
      status: "qualified",
      estimatedValue: 4800,
      location: "Ridgewood, NJ",
      notes: "Looking to replace 65ft of rotting wood railing on second-story deck with black powder-coated aluminum.",
      date: "10 mins ago",
      isDemo: true,
    },
    {
      id: "demo_lead_2",
      name: "Mike Rodriguez",
      phone: "(973) 555-8912",
      email: "m.rodriguez@example.com",
      service: "Fence Installation",
      source: "Website",
      status: "won",
      estimatedValue: 6400,
      location: "Clifton, NJ",
      notes: "150ft white vinyl privacy fence with 2 walk gates. Contract signed and scheduled for next Tuesday.",
      date: "45 mins ago",
      isDemo: true,
    },
    {
      id: "demo_lead_3",
      name: "David Chen",
      phone: "(201) 555-3349",
      email: "dchen77@example.com",
      service: "Railing Repair",
      source: "Phone",
      status: "estimate",
      estimatedValue: 650,
      location: "Paramus, NJ",
      notes: "Front porch wrought iron railing is loose at brick base. Estimate sent this morning.",
      date: "2 hours ago",
      isDemo: true,
    },
    {
      id: "demo_lead_4",
      name: "Robert Kowalski",
      phone: "(973) 555-7201",
      email: "rkowalski@example.com",
      service: "Metal Fabrication",
      source: "Meta",
      status: "new",
      estimatedValue: 8500,
      location: "Wayne, NJ",
      notes: "Custom ornamental driveway double swing gate with automatic gate opener integration.",
      date: "3 hours ago",
      isDemo: true,
    },
    {
      id: "demo_lead_5",
      name: "Emily Watson",
      phone: "(201) 555-9182",
      email: "emily.watson@example.com",
      service: "Fence Installation",
      source: "Meta",
      status: "contacted",
      estimatedValue: 5200,
      location: "Montclair, NJ",
      notes: "Need pool safety code-compliant 54-inch black aluminum fence for in-ground pool.",
      date: "5 hours ago",
      isDemo: true,
    },
    {
      id: "demo_lead_6",
      name: "Carlos Mendez",
      phone: "(973) 555-6110",
      email: "carlos.mendez@example.com",
      service: "Railing Repair",
      source: "Phone",
      status: "won",
      estimatedValue: 1200,
      location: "Paterson, NJ",
      notes: "Three flight commercial stair railing weld and anchor reinforcement. Completed yesterday.",
      date: "1 day ago",
      isDemo: true,
    },
    {
      id: "demo_lead_7",
      name: "Linda Brooks",
      phone: "(973) 555-2244",
      email: "lbrooks@example.com",
      service: "Aluminum Railing",
      source: "Meta",
      status: "qualified",
      estimatedValue: 7800,
      location: "Morristown, NJ",
      notes: "Modern horizontal cable/aluminum combo railing for contemporary home remodel.",
      date: "1 day ago",
      isDemo: true,
    },
    {
      id: "demo_lead_8",
      name: "James Thornton",
      phone: "(201) 555-6677",
      email: "jthornton@example.com",
      service: "Fence Installation",
      source: "Website",
      status: "new",
      estimatedValue: 4500,
      location: "Hackensack, NJ",
      notes: "Western red cedar shadowbox fence around backyard perimeter. Wants quote on staining.",
      date: "2 days ago",
      isDemo: true,
    },
  ],

  creatives: [
    {
      id: "demo_creat_1",
      campaignName: "Aluminum Railing",
      headline: "Upgrade Your Deck With Lifetime Aluminum Railings",
      primaryText:
        "Tired of scraping and painting rotting wood railings? NJ Fence and Railing installs ultra-durable, maintenance-free aluminum railings in stunning matte black and bronze finishes. Guaranteed rust-free for 20 years. Book your free in-home consultation today!",
      description: "njfence.com/aluminum-railings",
      cta: "Get Free Quote",
      aspectRatio: "1:1",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop",
      performanceScore: 94,
      isDemo: true,
    },
    {
      id: "demo_creat_2",
      campaignName: "Fence Installation",
      headline: "Beautiful Privacy Fencing Installed In 48 Hours",
      primaryText:
        "Secure your property and elevate your curb appeal with Northern New Jersey's highest-rated fence installer. Vinyl, cedar, and security aluminum options available with zero down financing. Contact NJ Fence and Railing today!",
      description: "njfence.com/fence-installation",
      cta: "Claim $250 Off",
      aspectRatio: "4:5",
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
      performanceScore: 91,
      isDemo: true,
    },
    {
      id: "demo_creat_3",
      campaignName: "Railing Repair",
      headline: "Loose or Rusted Railings? Same-Day Safety Repairs",
      primaryText:
        "Don't fail inspection or risk a slip-and-fall. Our mobile welding and repair trucks service Bergen & Passaic counties daily. We fix loose base plates, rusted spindles, and wobbly stair railings quickly and affordably.",
      description: "njfence.com/railing-repair",
      cta: "Call Now",
      aspectRatio: "9:16",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop",
      performanceScore: 88,
      isDemo: true,
    },
    {
      id: "demo_creat_4",
      campaignName: "Metal Fabrication",
      headline: "Custom Wrought Iron & Ornamental Gate Fabrication",
      primaryText:
        "Handcrafted in New Jersey. Elevate your entrance with bespoke driveway gates, security doors, and ornamental railings built precisely to your architectural specifications.",
      description: "njfence.com/custom-fabrication",
      cta: "View Portfolio",
      aspectRatio: "16:9",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop",
      performanceScore: 89,
      isDemo: true,
    },
  ],

  recommendations: [
    {
      id: "demo_rec_1",
      title: "Increase Daily Budget on 'Railing Repair'",
      explanation:
        "The 'Railing Repair' campaign has the highest conversion efficiency in your portfolio with a $28.33 Cost Per Lead and an above-average 4.1% CTR. Demand peaks on weekends.",
      evidence: "Current daily budget is capped at $30/day. High intent calls represent 72% of conversions.",
      confidence: 94,
      action_type: "increase_budget",
      action_payload: { campaignId: "demo_camp_3", newBudget: 45 },
      impact_metric: "Estimated Additional Leads",
      impact_value: "+8 leads/month",
      status: "pending",
      isDemo: true,
    },
    {
      id: "demo_rec_2",
      title: "Launch A/B Image Test for 'Aluminum Railing'",
      explanation:
        "Visual ads featuring matte black horizontal railings outperform traditional white baluster photos by 2.3x CTR among Bergen County homeowners aged 35-55.",
      evidence: "Creative #1 CTR: 3.4%. Testing an aerial deck view is projected to lower CPL by 15%.",
      confidence: 89,
      action_type: "change_creative",
      action_payload: { campaignId: "demo_camp_1", newCreativeId: "demo_creat_1" },
      impact_metric: "Estimated CPL Reduction",
      impact_value: "-$5.20 per lead",
      status: "pending",
      isDemo: true,
    },
    {
      id: "demo_rec_3",
      title: "Expand 'Fence Installation' Geographic Targeting",
      explanation:
        "High inquiry density is spilling over into Western Morris County and Rockland County borders. Expanding radius by 6 miles captures an additional 22,000 single-family households.",
      evidence: "18% of website traffic originates just outside current 25-mile boundary radius.",
      confidence: 86,
      action_type: "change_audience",
      action_payload: { campaignId: "demo_camp_2", radiusMiles: 31 },
      impact_metric: "Expanded Audience Reach",
      impact_value: "+22,000 households",
      status: "pending",
      isDemo: true,
    },
  ],

  analytics: {
    summary: {
      totalSpend: 2640.0,
      totalLeads: 86,
      averageCpl: 30.7,
      totalCalls: 49,
      activeCampaigns: 3,
    },
    monthlyData: [
      { month: "May", spend: 400, leads: 12, cpl: 33.33 },
      { month: "Jun", spend: 450, leads: 15, cpl: 30.0 },
      { month: "Jul", spend: 520, leads: 18, cpl: 28.88 },
      { month: "Aug", spend: 580, leads: 19, cpl: 30.52 },
      { month: "Sep", spend: 390, leads: 12, cpl: 32.5 },
      { month: "Oct", spend: 300, leads: 10, cpl: 30.0 },
    ],
    activeCampaigns: 3,
    totalLeads: 86,
    avgCpl: 30.7,
    totalSpend: 2640.0,
    callsReceived: 49,
    formLeads: 37,
    conversionRate: 11.4,
    impressions: 86400,
    clicks: 2848,
    isDemo: true,
  },
};

export const NJ_FENCE_SERVICES = INITIAL_DEMO_DATA.services;
export const NJ_FENCE_CAMPAIGNS = INITIAL_DEMO_DATA.campaigns;
export const DEMO_BUSINESS_PROFILE = INITIAL_DEMO_DATA.business;

/**
 * In-Memory Demo State Store (Isolated from production tables)
 */
class DemoStore {
  private data = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));

  public getBusiness(): DemoBusinessProfile {
    return this.data.business;
  }

  public getBusinessProfile(): DemoBusinessProfile {
    return this.data.business;
  }

  public getServices(): DemoService[] {
    return [...this.data.services];
  }

  public getCampaigns(): DemoCampaign[] {
    return [...this.data.campaigns];
  }

  public getLeads(): DemoLead[] {
    return [...this.data.leads];
  }

  public getCreatives(): DemoCreative[] {
    return [...this.data.creatives];
  }

  public getRecommendations(): DemoRecommendation[] {
    return [...this.data.recommendations];
  }

  public getAnalytics(): DemoAnalyticsSummary {
    return this.data.analytics;
  }

  public addLead(lead: Omit<DemoLead, "id" | "isDemo">): DemoLead {
    const newLead: DemoLead = {
      ...lead,
      id: `demo_lead_${Date.now()}`,
      isDemo: true,
    };
    this.data.leads.unshift(newLead);
    this.data.analytics.totalLeads += 1;
    return newLead;
  }

  public addCampaign(campaign: Omit<DemoCampaign, "id" | "isDemo">): DemoCampaign {
    const newCampaign: DemoCampaign = {
      ...campaign,
      id: `demo_camp_${Date.now()}`,
      isDemo: true,
    };
    this.data.campaigns.unshift(newCampaign);
    this.data.analytics.activeCampaigns += 1;
    return newCampaign;
  }

  public reset(): void {
    this.data = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }
}

export const demoStore = new DemoStore();
