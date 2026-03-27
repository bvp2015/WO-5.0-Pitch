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
  email: string;
  role: string;
  class: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

interface UserTableProps {
  users: User[];
  onEditUser: (user: User) => void;
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
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          onDeleteUser(user.id);
        }
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
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider"> </th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Status</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Last modified</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Deployed by</th>
              <th className="text-left py-3 px-4 text-xs uppercase text-gray-500 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.name}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.role}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{user.class}</div>
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
                  <div className="text-gray-600">{user.email}</div>
                </td>
                <td className="py-4 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAction('Details', user)}>
                        Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('Modify', user)}>
                        Modify
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAction('Uninstall', user)}>
                        Uninstall
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleAction('Uninstall', user)}
                      >
                        Uninstall
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