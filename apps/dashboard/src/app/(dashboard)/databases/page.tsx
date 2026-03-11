'use client';

import { useState } from 'react';
import { Database, Plus, Search, Layers, RefreshCw } from 'lucide-react';

export default function DatabasesPage() {
  const [search, setSearch] = useState('');

  // Sample data simulating the DB state
  const databases = [
    { id: 1, name: 'production-db', type: 'PostgreSQL', version: '15', status: 'Running', host: '159.89.175.178', db: 'platform_main', size: '245 MB' },
    { id: 2, name: 'analytics-redis', type: 'Redis', version: '7.0', status: 'Running', host: '159.89.175.178', db: '0', size: '12 MB' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Managed Databases</h1>
          <p className="text-sm text-slate-400 mt-1">Deploy and manage SQL and NoSQL databases.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          <Plus className="mr-2 w-4 h-4" />
          Create Database
        </button>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-dark-600 rounded-lg bg-dark-950 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search databases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-950">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Engine</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Host</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Storage</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700 bg-dark-900">
              {databases.map((db) => (
                <tr key={db.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Database className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{db.name}</div>
                        <div className="text-sm text-slate-500">DB: {db.db}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{db.type}</div>
                    <div className="text-xs text-slate-500">v{db.version}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      {db.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                    {db.host}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-300">
                      <Layers className="mr-1.5 h-4 w-4 text-slate-500" />
                      {db.size}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-500 hover:text-primary-400 transition-colors">Manage</button>
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
