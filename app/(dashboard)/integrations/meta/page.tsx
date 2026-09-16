"use client";

import { useState, useEffect } from "react";
import { Share2, CheckCircle2, AlertTriangle, RefreshCw, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

function MetaIntegrationContent() {
  const searchParams = useSearchParams();
  const [isConnected, setIsConnected] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [account, setAccount] = useState<{ pageName: string | null; adAccountId: string | null; adAccountName: string | null }>({ pageName: null, adAccountId: null, adAccountName: null });

  const refreshStatus = async () => {
    const response = await fetch("/api/integrations/meta/status", { cache: "no-store" });
    if (!response.ok) return;
    const status = await response.json();
    setIsConfigured(Boolean(status.configured));
    setIsConnected(Boolean(status.connected));
    setAccount({ pageName: status.pageName ?? null, adAccountId: status.adAccountId ?? null, adAccountName: status.adAccountName ?? null });
  };

  useEffect(() => {
    void refreshStatus();
  }, [searchParams]);

  const handleConnect = () => {
    setIsConnecting(true);
    window.location.href = "/api/auth/meta/start";
  };

  const handleDisconnect = async () => {
    const response = await fetch("/api/integrations/meta/disconnect", { method: "DELETE" });
    if (response.ok) await refreshStatus();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Meta Integration</h1>
        <p className="mt-1 text-sm text-slate-500">
          Connect your Facebook and Instagram accounts to publish ads and sync leads.
        </p>
      </div>

      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Integration Not Configured</h3>
            <p className="text-sm text-amber-700 mt-1">
              The META_APP_ID and META_APP_SECRET environment variables are missing. 
              Please configure your Facebook Developer App to enable this feature.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Share2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Facebook & Instagram Ads</h2>
              <p className="text-sm text-slate-500">Publish campaigns, manage ad sets, and track performance.</p>
            </div>
          </div>
          
          <div>
            {isConnected ? (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                Disconnected
              </span>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50">
          {isConnected ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Connected Account</p>
                  <p className="font-medium text-slate-900">{account.pageName || "No Page selected"}</p>
                </div>
                <div className="bg-white p-4 border border-slate-200 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Ad Account</p>
                  <p className="font-medium text-slate-900">{account.adAccountName || "No ad account selected"}</p>
                  {account.adAccountId && <p className="text-xs text-slate-500 mt-0.5">ID: {account.adAccountId}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDisconnect}
                  className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 bg-white flex items-center transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Disconnect
                </button>
                <button onClick={() => void refreshStatus()} className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-50 bg-white flex items-center transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh Connection
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <p className="text-slate-600 mb-6 max-w-md">
                Connect your Meta Business account to allow Contractor AI Ads to publish campaigns directly to your Facebook and Instagram pages.
              </p>
              <button 
                onClick={handleConnect}
                disabled={!isConfigured || isConnecting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Connecting...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" /> Connect with Meta
                  </>
                )}
              </button>
              <p className="text-xs text-slate-400 mt-4">
                We use secure OAuth 2.0. We never see your password.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MetaIntegrationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading integration...</div>}>
      <MetaIntegrationContent />
    </Suspense>
  );
}
