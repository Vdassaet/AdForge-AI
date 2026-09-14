"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Save } from "lucide-react";
import { demoStore } from "@/lib/demo/demo-data";
import { SimulatedBadge } from "@/components/demo/simulated-badge";

export default function BusinessProfilePage() {
  const business = demoStore.getBusiness();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: business.name,
    legalName: business.legalName,
    description: business.description,
    phone: business.phone,
    email: business.email,
    website: business.website,
    industry: business.industry,
    category: "Fence & Custom Railing Contractor",
    years: "15",
    radius: "30",
    license: "NJ HIC #13VH09876500",
    insurance: "$2,000,000 General Commercial Liability",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Business profile saved successfully (Simulated)!");
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Profile</h1>
            <SimulatedBadge variant="outline" label="Demo Profile" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your profile so our AI can generate hyper-relevant ad copy tailored to your business.
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  This information serves as the baseline context for AI ad generation and local targeting.
                </CardDescription>
              </div>
              <SimulatedBadge variant="subtle" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalName">Legal Business Name</Label>
                <Input
                  id="legalName"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Years in Business</Label>
                <Input
                  id="years"
                  type="number"
                  value={formData.years}
                  onChange={(e) => setFormData({ ...formData, years: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius">Service Radius (Miles)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Information</Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Information</Label>
                <Input
                  id="insurance"
                  value={formData.insurance}
                  onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t bg-muted/20 py-4">
            <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
