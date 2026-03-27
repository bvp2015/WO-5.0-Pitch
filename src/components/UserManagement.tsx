import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { UserTable } from "./UserTable";
import { AddUserModal } from "./AddUserModal";
import { StatCard } from "./StatCard";
import { toast } from "sonner@2.0.3";

interface User {
  id: string;
  name: string;
  Version:string;
  status: "Active" | "Inactive";
  lastLogin: string;
  Infra: string;
  ResUtilization: number;

}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Nginx Ingress",
    Version: "1.1.0",
    status: "Active",
    lastLogin: "2 hours ago",
    Infra: "VMs",
    ResUtilization: "75%",
  },
  {
    id: "2",
    name: "Nginx Ingress",
    Infra: "VMs",
    Version: "1.1.1",
    status: "Active",
    lastLogin: "1 day ago",
    ResUtilization: "60%",
  },
  {
    id: "3",
    name: "AVEVA System Platform",
    Infra: "k8s",
    Version: "2.1.0",
    status: "Active",
    lastLogin: "10 minutes ago",
    ResUtilization: "80%",
  },
  {
    id: "4",
    name: "Prometheus",
    Infra: "VMs",
    Version: "1.3.0",
    status: "Inactive",
    lastLogin: "1 week ago",
    ResUtilization: "50%",
  },
  {
    id: "5",
    name: "Grafana",
    Infra: "VMs",
    Version: "3.1.0",
    status: "Active",
    lastLogin: "3 hours ago",
    ResUtilization: "70%",
  },
  {
    id: "6",
    name: "Grafana",
    Infra: "K8s",
    Version: "0.1.0",
    status: "Active",
    lastLogin: "2 days ago",
    ResUtilization: "65%",
  },
  {
    id: "7",
    name: "Aveva systems",
    Infra: "K8s",
    Version: "4.1.0",
    status: "Active",
    lastLogin: "4 hours ago",
   ResUtilization: "65%",

  },
  {
    id: "8",
    name: "InfluxDB",
    Infra: "VMs",
    Version: "1.0.0",
    status: "Active",
    lastLogin: "6 hours ago",
    ResUtilization: "55%",
  },
];

interface UserManagementProps {
  onNavigate?: (page: string) => void;
}

export function UserManagement({ onNavigate }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.status === "Active",
  ).length;
  const clusterCount = users.filter(
    (u) => u.role === "Clusters",
  ).length;
  const vmCount = users.filter(
    (u) => u.role === "VMs",
  ).length;
  const k8sCount = users.filter(
    (u) => u.role === "K8s",
  ).length;

  const handleAddNewUser = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
    toast.success(
      `${newUser.name} has been added successfully!`,
    );
  };

  const handleEditUser = (user: User) => {
    toast.info(
      `Details functionality for ${user.name} will be implemented.`,
    );
  };

  const handleViewUser = (user: User) => {
    toast.info(`Modify functionality for the ${user.name} will be implemented.`);
  };

  const handleResetPassword = (user: User) => {
    toast.info(`Uninstall functionality for the ${user.name} will be implemented.`);

  };

 const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    toast.info(`Delete functionality for the ${user.name} will be implemented.`);

  };

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(e.target.value);
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user.Infra
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.Infra.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus =
      statusFilter === "all" ||
      user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl text-gray-900 mb-2">
              Workloads
            </h1>
            <p className="text-gray-600">
              Manage and monitor workloads deployed across your infrastructure
            </p>
          </div>
          <Button
            onClick={() => onNavigate?.('marketplace')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add new workload
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 border border-purple-200">Tenant: Contoso</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 border border-orange-200">Subscription: Enterprise</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 border border-blue-200">Cluster: Abc</span>
          </div>
          <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by workload name or infra details..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-40 bg-gray-50 border-gray-200">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Infra</SelectItem>

              <SelectItem value="vms">VMs</SelectItem>
              <SelectItem value="k8s">K8s</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-50 bg-gray-50 border-gray-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Deployment status
              </SelectItem>
              <SelectItem value="active">Deployed</SelectItem>
              <SelectItem value="inactive">
                Uninstalled
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Workloads"
            value={totalUsers.toString()}
            subtitle="Currently deployed workloads"
            gradient="bg-gradient-to-br from-slate-400 to-slate-600"
          />
          <StatCard
            title="Deployed Users"
            value={activeUsers.toString()}
            subtitle="Total users"
            gradient="bg-gradient-to-br from-green-300 to-emerald-500"
          />
          <StatCard
            title="1P Workloads"
            value= "5"
            subtitle="Microsoft applications"
            gradient="bg-gradient-to-br from-blue-300 to-indigo-500"
          />
          <StatCard
            title="3P Workloads"
            value= "3"
            subtitle="Custom applications"
            gradient="bg-gradient-to-br from-purple-300 to-violet-500"
          />
        </div>

        {/* User Directory Section - Full Height */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg text-gray-900 mb-2">
              Workload list
            </h2>
            <p className="text-gray-600">
              Search and filter workloads (
              {filteredUsers.length} workloads)
            </p>
          </div>

          {/* User Table - Takes remaining space */}
          <div className="flex-1">
            <UserTable
              users={filteredUsers}
              onEditUser={handleEditUser}
              onViewUser={handleViewUser}
              onResetPassword={handleResetPassword}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAddUser={handleAddUser}
      />
    </div>
  );
}