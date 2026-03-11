'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Server, Activity, Folder, Database, 
  ArrowUpRight, AlertCircle, Clock
} from 'lucide-react';

interface DashboardMetrics {
  totalServers: number;
  activeDeployments: number;
  totalProjects: number;
  totalDatabases: number;
}

export default function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        // In a real app we'd fetch actual metrics here
        // Simulating for now
        setTimeout(() => {
          setMetrics({
            totalServers: 1,
            activeDeployments: 0,
            totalProjects: 0,
            totalDatabases: 4
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch metrics', error);
      }
    };
    fetchMetrics();
  }, []);

  const statCards = [
    { name: 'Total Servers', value: metrics?.totalServers || 0, icon: Server, change: '+1 this week', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Projects', value: metrics?.totalProjects || 0, icon: Folder, change: '0 deployed', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Deployments', value: metrics?.activeDeployments || 0, icon: Activity, change: '100% success rate', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Managed DBs', value: metrics?.totalDatabases || 0, icon: Database, change: '+4 services', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor your infrastructure health and activity.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          New Project
          <ArrowUpRight className="ml-2 w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl bg-dark-900 border border-dark-700 p-5 shadow-sm hover:border-dark-600 transition-colors"
          >
            <dt>
              <div className={`absolute rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-400">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-bold text-white">
                {loading ? <span className="animate-pulse bg-dark-700 h-8 w-12 rounded inline-block" /> : stat.value}
              </p>
              <p className="ml-2 flex items-baseline text-sm font-medium text-slate-500">
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-dark-900 border border-dark-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-dark-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Recent Deployments</h3>
            <button className="text-sm text-primary-500 hover:text-primary-400 font-medium">View all</button>
          </div>
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Activity className="w-12 h-12 mb-4 text-dark-700" />
            <p>No successful deployments yet.</p>
            <p className="text-sm mt-1">Connect a GitHub repository to get started.</p>
          </div>
        </div>

        <div className="rounded-xl bg-dark-900 border border-dark-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-dark-700">
            <h3 className="text-lg font-medium text-white">System Alerts</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-start bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-400">Welcome to ServerMG!</h4>
                <p className="text-xs text-blue-500/80 mt-1">Your core infrastructure is up and running. Try deploying your first app.</p>
              </div>
            </div>

            {loading ? null : (
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-slate-300">Server Connected</h4>
                  <p className="text-xs text-slate-500 mt-1">Agent successfully connected to master node.</p>
                  <span className="text-[10px] text-slate-600 mt-2 block">Just now</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
