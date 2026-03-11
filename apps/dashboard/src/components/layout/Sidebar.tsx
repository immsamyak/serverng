'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Server, Globe, Database, 
  TerminalSquare, FileBox, ShieldAlert,
  Users, Activity, Settings, CreditCard, Key
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: FileBox },
  { name: 'Servers', href: '/dashboard/servers', icon: Server },
  { name: 'Domains & SSL', href: '/dashboard/domains', icon: Globe },
  { name: 'Databases', href: '/dashboard/databases', icon: Database },
  { name: 'Monitoring', href: '/dashboard/monitoring', icon: Activity },
  { name: 'Terminal', href: '/dashboard/terminal', icon: TerminalSquare },
];

const secondaryNavigation = [
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Security', href: '/dashboard/security', icon: ShieldAlert },
  { name: 'API Keys', href: '/dashboard/apikeys', icon: Key },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const isCurrent = (href: string) => {
    if (href === '/dashboard' && pathname !== '/dashboard') return false;
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex h-full w-64 flex-col bg-dark-900 border-r border-dark-700">
      <div className="flex h-16 shrink-0 items-center px-6">
        <Server className="h-8 w-8 text-primary-500" />
        <span className="ml-3 text-xl font-bold text-white tracking-tight">ServerMG</span>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const current = isCurrent(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  current
                    ? 'bg-primary-600/10 text-primary-500'
                    : 'text-slate-400 hover:bg-dark-800 hover:text-white',
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    current ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-8 mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account Management
          </div>

          {secondaryNavigation.map((item) => {
            const current = isCurrent(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  current
                    ? 'bg-primary-600/10 text-primary-500'
                    : 'text-slate-400 hover:bg-dark-800 hover:text-white',
                  'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    current ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300',
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
