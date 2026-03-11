'use client';

import { Activity, Cpu, Server, HardDrive } from 'lucide-react';

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Monitoring</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time health metrics and analytics.</p>
        </div>
        <select className="bg-dark-900 border border-dark-700 text-white text-sm rounded-lg px-3 py-2 outline-none">
          <option>Last 1 Hour</option>
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-900 rounded-xl border border-dark-700 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-medium">CPU Utilization</span>
            <Cpu className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">12%</div>
          <div className="h-24 flex items-end space-x-2">
            {[30, 45, 20, 10, 15, 8, 12, 40, 60, 25, 12, 12].map((val, i) => (
              <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-900 rounded-xl border border-dark-700 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-medium">Memory Usage</span>
            <Server className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">45% <span className="text-sm text-slate-500 font-normal ml-2">900MB / 2GB</span></div>
          <div className="h-24 flex items-end space-x-2">
            {[40, 42, 45, 45, 44, 46, 45, 45, 47, 46, 45, 45].map((val, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm relative">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-sm transition-all" 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-900 rounded-xl border border-dark-700 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-sm font-medium">Network I/O</span>
            <Activity className="w-5 h-5 opacity-50" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">2.4 <span className="text-sm text-slate-500 font-normal">MB/s</span></div>
          <div className="h-24 flex items-end space-x-2">
            {[10, 15, 8, 30, 60, 40, 20, 15, 25, 35, 12, 22].map((val, i) => (
              <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-emerald-500 rounded-t-sm transition-all" 
                  style={{ height: `${val}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-dark-900 rounded-xl border border-dark-700 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-700">
          <h3 className="text-lg font-medium text-white">Container Metrics</h3>
        </div>
        <div className="p-8 text-center text-slate-500 flex flex-col items-center">
            <HardDrive className="w-12 h-12 mb-4 text-dark-700" />
            <p>No active project containers are running to monitor.</p>
        </div>
      </div>
    </div>
  );
}
