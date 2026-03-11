'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Server, Activity, Plus, Terminal, RefreshCw, MoreVertical } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider';

interface ServerData {
  id: string;
  name: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE' | 'INSTALLING';
  metrics?: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export default function ServersPage() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulated fetch for the UI wrapper
    setTimeout(() => {
      setServers([
        {
          id: 'server-1',
          name: 'Main Droplet',
          ipAddress: '159.89.175.178',
          status: 'ONLINE',
          metrics: { cpu: 12, memory: 45, disk: 30 }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Servers</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your connected infrastructure nodes.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          <Plus className="mr-2 w-4 h-4" />
          Connect Server
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="animate-pulse bg-dark-900 border border-dark-700 rounded-xl h-32" />
        ) : servers.length === 0 ? (
          <div className="text-center py-12 rounded-xl border border-dashed border-dark-700 bg-dark-900/50">
            <Server className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-4 text-sm font-semibold text-white">No servers</h3>
            <p className="mt-1 text-sm text-slate-400">Get started by connecting your first cloud server.</p>
            <div className="mt-6">
              <button type="button" className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Connect Server
              </button>
            </div>
          </div>
        ) : (
          servers.map((server) => (
            <div key={server.id} className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden shadow-sm hover:border-dark-600 transition-colors">
              <div className="p-5 flex items-center justify-between border-b border-dark-700">
                <div className="flex items-center space-x-4">
                  <div className={`p-2.5 rounded-lg ${server.status === 'ONLINE' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    <Server className={`w-6 h-6 ${server.status === 'ONLINE' ? 'text-emerald-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{server.name}</h3>
                    <div className="flex items-center mt-1 space-x-3 text-sm text-slate-400">
                      <span className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${server.status === 'ONLINE' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {server.status}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-xs bg-dark-800 px-2 py-0.5 rounded border border-dark-700">
                        {server.ipAddress}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors" title="Open Terminal">
                    <Terminal className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors" title="Sync Status">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {server.metrics && (
                <div className="bg-dark-950 p-5 grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-slate-400">CPU Usage</span>
                      <span className="text-sm font-bold text-white">{server.metrics.cpu}%</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${server.metrics.cpu > 80 ? 'bg-red-500' : server.metrics.cpu > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${server.metrics.cpu}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-slate-400">Memory</span>
                      <span className="text-sm font-bold text-white">{server.metrics.memory}%</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${server.metrics.memory > 80 ? 'bg-red-500' : server.metrics.memory > 50 ? 'bg-yellow-500' : 'bg-indigo-500'}`} style={{ width: `${server.metrics.memory}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-slate-400">Disk Space</span>
                      <span className="text-sm font-bold text-white">{server.metrics.disk}%</span>
                    </div>
                    <div className="w-full bg-dark-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${server.metrics.disk > 90 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${server.metrics.disk}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
