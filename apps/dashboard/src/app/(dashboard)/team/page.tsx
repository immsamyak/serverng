'use client';

import { Users, UserPlus, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider';

export default function TeamPage() {
  const { user } = useAuth();
  
  const team = [
    { id: 1, name: user?.name || 'Admin User', email: user?.email || 'admin@servermg.local', role: 'Owner', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Management</h1>
          <p className="text-sm text-slate-400 mt-1">Invite team members and manage role-based access.</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm inline-flex items-center">
          <UserPlus className="mr-2 w-4 h-4" />
          Invite Member
        </button>
      </div>

      <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-dark-700 bg-dark-950">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-primary-500" />
            Active Members
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-700">
            <thead className="bg-dark-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700 bg-dark-900">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-600/20 text-primary-500 flex items-center justify-center font-bold border border-primary-500/20">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-400">
                      <Mail className="h-4 w-4 mr-2" />
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-slate-300">
                      <Shield className="h-4 w-4 mr-2 text-indigo-400" />
                      {member.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-slate-400 hover:text-white transition-colors" disabled={member.role === 'Owner'}>Edit</button>
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
