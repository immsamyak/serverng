'use client';

import { Settings, Save, Github, Link } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../../providers/AuthProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const [githubConnected, setGithubConnected] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your platform preferences and integrations.</p>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-700 bg-dark-950">
          <h3 className="text-lg font-medium text-white">Profile Information</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
              <input
                type="text"
                defaultValue={user?.name || ''}
                className="block w-full px-3 py-2 border border-dark-600 rounded-lg bg-dark-950 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                type="email"
                disabled
                defaultValue={user?.email || ''}
                className="block w-full px-3 py-2 border border-dark-700 rounded-lg bg-dark-800 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
              <Save className="mr-2 w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-700 bg-dark-950">
          <h3 className="text-lg font-medium text-white">Integrations</h3>
          <p className="text-sm text-slate-400 mt-1">Connect third-party services to enable automatic deployments.</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-dark-700 rounded-lg bg-dark-950">
            <div className="flex items-center">
              <div className="p-3 bg-dark-800 rounded-lg border border-dark-600 mr-4">
                <Github className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">GitHub</h4>
                <p className="text-sm text-slate-400 mt-0.5">Required for push-to-deploy workflows.</p>
              </div>
            </div>
            {githubConnected ? (
              <button className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 rounded-lg font-medium text-sm transition-colors">
                Disconnect
              </button>
            ) : (
              <button 
                onClick={() => setGithubConnected(true)}
                className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-lg font-medium text-sm transition-colors inline-flex items-center"
              >
                <Link className="w-4 h-4 mr-2" />
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-red-500/20 rounded-xl overflow-hidden shadow-sm relative">
        <div className="p-5 border-b border-dark-700 bg-red-500/5">
          <h3 className="text-lg font-medium text-red-500">Danger Zone</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Delete Account</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-lg">
                Permanently delete your account and all associated resources. This action cannot be undone and instantly terminates all active servers and applications.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-medium text-sm transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
