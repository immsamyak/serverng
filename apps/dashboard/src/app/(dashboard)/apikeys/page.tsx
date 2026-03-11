'use client';

import { Key, Copy, Plus, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([
    { id: '1', name: 'GitHub Action Deployer', prefix: 'smg_prod_', created: '2026-03-01', lastUsed: '2 hours ago' },
    { id: '2', name: 'CLI Access', prefix: 'smg_dev_', created: '2026-02-15', lastUsed: '3 days ago' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">API Keys</h1>
          <p className="text-sm text-slate-400 mt-1">Manage tokens for programmatic access to the ServerMG platform.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          <Plus className="mr-2 w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-yellow-500">Protect your API keys</h4>
          <p className="text-sm text-yellow-500/80 mt-1">
            API keys carry the same privileges as your user account. Do not share them or commit them in your repositories. 
            If a key is compromised, delete it immediately and generate a new one.
          </p>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-700 bg-dark-950">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Key className="w-5 h-5 mr-2 text-primary-500" />
            Active Tokens
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name / Identifier</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Token Prefix</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Used</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700 bg-dark-900">
              {keys.map((key) => (
                <tr key={key.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{key.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                       <code className="bg-dark-950 px-2 py-1 rounded text-sm text-slate-300 font-mono border border-dark-700">
                         {key.prefix}••••••••••••••••
                       </code>
                       <button className="text-slate-500 hover:text-white transition-colors" title="Copy Prefix">
                         <Copy className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {key.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {key.lastUsed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-500 hover:text-red-400 transition-colors">Revoke</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
