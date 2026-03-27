import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface User {
  id: string;
  name: string;
  Infra: string;
  Version: string;
  class: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  storageUtil: number;

}

interface UserTableProps {
  users: User[];
  onDetailsUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserTable({ users, onEditUser, onViewUser, onResetPassword, onDeleteUser }: UserTableProps) {
  const handleAction = (action: string, user: User) => {
    switch (action) {
      case 'Details':
        onEditUser(user);
        break;
      case 'Modify':
        onViewUser(user);
        break;
      case 'Uninstall':
        onResetPassword(user);
        break;
      case 'Delete':
        onDeleteUser(user.id);
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Workload</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Version</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Last modified</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Infrastructure</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Storage Utilization</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.Version}</div>
                </td>

                <td className="py-4 px-4">
                  <Badge 
                    variant={user.status === 'Active' ? 'default' : 'secondary'}
                    className={user.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
                  >
                    {user.status === 'Active' ? 'Deployed' : 'Uninstalled'}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600">{user.lastLogin}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-600">{user.Infra}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.storageUtil}</div>
                </td>
                <td className="py-4 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-300 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <DropdownMenuItem onClick={() => handleAction('Details', user)} className="cursor-pointer">
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('Modify', user)} className="cursor-pointer">
                        Modify
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('Uninstall', user)} className="cursor-pointer">
                        Uninstall
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600 cursor-pointer"
                        onClick={() => handleAction('Delete', user)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}