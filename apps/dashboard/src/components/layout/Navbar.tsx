'use client';

import { useAuth } from '../../providers/AuthProvider';
import { LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-dark-700 bg-dark-900/80 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-dark-700" aria-hidden="true" />
            <div className="flex items-center gap-x-4 px-2 py-1 bg-dark-800 border border-dark-700 rounded-full cursor-default">
              <span className="sr-only">Your profile</span>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-2 text-sm font-medium leading-6 text-slate-200 pr-2" aria-hidden="true">
                  {user?.name || user?.email?.split('@')[0]}
                </span>
              </span>
            </div>
            
            <button 
              onClick={() => logout()}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-400/20"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
