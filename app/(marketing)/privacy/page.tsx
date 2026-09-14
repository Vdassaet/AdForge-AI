/* eslint-disable react/no-unescaped-entities */  
export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
        <p className="text-slate-500">Last Updated: October 2023</p>
      </div>

      <div className="prose prose-lg prose-slate mx-auto">
        <h2>1. Introduction</h2>
        <p>
          At Contractor AI Ads (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and use our SaaS application.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect several types of information from and about users of our Website, including:
        </p>
        <ul>
          <li><strong>Personal Data:</strong> Email address, first name, last name, phone number, and billing information (processed securely via Stripe).</li>
          <li><strong>Business Data:</strong> Information about your business, service areas, and advertising assets uploaded to the platform.</li>
          <li><strong>Integration Data:</strong> Data from connected third-party platforms (like Meta/Facebook) necessary to run and monitor your advertising campaigns.</li>
          <li><strong>Usage Data:</strong> Information about how you interact with our application (e.g., page views, clicks).</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>
          We use information that we collect about you or that you provide to us to:
        </p>
        <ul>
          <li>Provide, maintain, and improve our platform and AI generation services.</li>
          <li>Process transactions and send related information including confirmations and invoices.</li>
          <li>Manage your account and provide customer support.</li>
          <li>Communicate with you about products, services, offers, and events.</li>
          <li>Synchronize campaigns and leads with connected Meta Business accounts.</li>
        </ul>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your Personal Data to outside parties except as described below:
        </p>
        <ul>
          <li><strong>Service Providers:</strong> We share data with trusted third parties who assist us in operating our application (e.g., Supabase for database hosting, Stripe for payments, OpenAI/Google for AI processing).</li>
          <li><strong>Platform Integrations:</strong> When you connect your Meta account, data flows between our platform and Meta according to their terms of service.</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information where required to do so by law.</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All payment transactions are encrypted using SSL technology and handled by Stripe.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          Depending on your location (such as under the GDPR or CCPA), you may have rights to access, correct, delete, or restrict the use of your personal data. You can manage most of this directly from your account dashboard or by contacting us at privacy@contractoraiads.com.
        </p>

        <h2>7. Changes to Our Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last Updated&quot; date.
        </p>
      </div>
    </div>
  );
}
