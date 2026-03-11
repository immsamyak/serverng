'use client';

import { TerminalSquare, Play, Square, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

export default function TerminalPage() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Terminal</h1>
          <p className="text-sm text-slate-400 mt-1">Direct shell access to your connected servers.</p>
        </div>
        
        <div className="flex items-center space-x-3 text-sm">
          <select className="bg-dark-900 border border-dark-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <option>159.89.175.178 (Main Droplet)</option>
          </select>
          
          <button 
            onClick={() => setConnected(!connected)}
            className={`px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center ${
              connected 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            {connected ? (
              <><Square className="w-4 h-4 mr-2" /> Disconnect</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Connect</>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-dark-950 rounded-xl border border-dark-700 overflow-hidden flex flex-col font-mono text-sm relative">
        <div className="h-10 bg-dark-900 border-b border-dark-700 flex items-center px-4 justify-between">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="text-slate-500 text-xs flex items-center">
            <TerminalSquare className="w-3.5 h-3.5 mr-1.5" />
            root@159.89.175.178:~
          </div>
          <button className="text-slate-500 hover:text-white transition-colors">
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto text-slate-300">
          {connected ? (
            <>
              <div className="text-emerald-500 mb-2">Connected to 159.89.175.178</div>
              <div>Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-1008-digitalocean x86_64)</div>
              <div className="mt-4 break-words">
                <span className="text-emerald-500">root@ubuntu-s-1vcpu-2gb-70gb-intel-blr1-01</span>:<span className="text-blue-400">~</span># <span className="animate-pulse">_</span>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <TerminalSquare className="w-12 h-12 mb-4 opacity-50" />
              <p>Click Connect to initiate an SSH websocket stream.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
