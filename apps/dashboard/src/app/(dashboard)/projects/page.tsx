'use client';

import { Folder, GitBranch, Play, MoreHorizontal, Github } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Deploy and manage your web applications.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          <Github className="mr-2 w-4 h-4" />
          Deploy from GitHub
        </button>
      </div>

      <div className="text-center py-16 rounded-xl border border-dashed border-dark-700 bg-dark-900/50">
        <Folder className="mx-auto h-12 w-12 text-slate-500" />
        <h3 className="mt-4 text-sm font-semibold text-white">No projects found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
          Let's get your first app running. Connect a repository from GitHub to configure automatic deployments.
        </p>
        <div className="mt-6">
          <button type="button" className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors">
            <Github className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Connect GitHub Account
          </button>
        </div>
      </div>
    </div>
  );
}
