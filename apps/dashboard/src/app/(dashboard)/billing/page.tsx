'use client';

import { CreditCard, Download, ExternalLink } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Plans</h1>
          <p className="text-sm text-slate-400 mt-1">Manage subscriptions, invoices, and payment methods.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-900 border border-dark-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium text-white mb-4">Current Subscription</h3>
            <div className="flex items-center justify-between p-4 bg-dark-950 border border-primary-500/30 rounded-lg">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-2">
                  Pro Tier
                </span>
                <div className="text-2xl font-bold text-white">$24.00 <span className="text-sm text-slate-500 font-normal">/ mo</span></div>
                <p className="text-sm text-slate-400 mt-1">Renews automatically on April 15, 2026</p>
              </div>
              <button className="px-4 py-2 border border-dark-600 hover:bg-dark-800 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
                Change Plan
              </button>
            </div>
          </div>

          <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-dark-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Payment Methods</h3>
              <button className="text-sm text-primary-500 hover:text-primary-400 font-medium">+ Add New</button>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between p-4 border border-dark-700 rounded-lg bg-dark-800/50">
                <div className="flex items-center">
                  <div className="h-8 w-12 bg-dark-700 rounded flex items-center justify-center mr-4">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Visa ending in 4242</div>
                    <div className="text-xs text-slate-400">Expires 12/28</div>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-dark-950 text-slate-300 rounded border border-dark-700">Default</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm h-fit">
          <div className="p-5 border-b border-dark-700">
            <h3 className="text-lg font-medium text-white">Recent Invoices</h3>
          </div>
          <div className="divide-y divide-dark-700">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-dark-800/50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">March 2026</div>
                  <div className="text-xs text-slate-400">$24.00 • Paid</div>
                </div>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
