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
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
  email: string;

}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Nginx Ingress",
    role: "1.1.0",
    status: "Active",
    lastLogin: "2 hours ago",
    email: "adaego.john@abc.org",

  },
  {
    id: "2",
    name: "Nginx Ingress",
    email: "okonma.chibuor@abc.org",
    role: "1.1.1",
    status: "Active",
    lastLogin: "1 day ago",
  },
  {
    id: "3",
    name: "AVEVA System Platform",
    email: "kemi.adebola@abc.org",
    role: "2.1.0",
    status: "Active",
    lastLogin: "10 minutes ago",
  },
  {
    id: "4",
    name: "Prometheus",
    email: "emeka.nwosu@abc.org",
    role: "1.3.0",
    status: "Inactive",
    lastLogin: "1 week ago",
  },
  {
    id: "5",
    name: "Grafana",
    email: "fatima.bello@abc.org",
    role: "3.1.0",
    status: "Active",
    lastLogin: "3 hours ago",
  },
  {
    id: "6",
    name: "Grafana",
    email: "tunde.bakare@abc.org",
    role: "0.1.0",
    status: "Active",
    lastLogin: "2 days ago",
  },
  {
    id: "7",
    name: "Aveva systems",
    email: "grace.okoro@abc.org",
    role: "4.1.0",
    status: "Active",
    lastLogin: "4 hours ago",
  },
  {
    id: "8",
    name: "InfluxDB",
    email: "yusuf.ibrahim@abc.org",
    role: "1.0.0",
    status: "Active",
    lastLogin: "6 hours ago",
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
      `Edit functionality for ${user.name} will be implemented.`,
    );
  };

  const handleViewUser = (user: User) => {
    toast.info(`Viewing details for ${user.name}.`);
  };

  const handleResetPassword = (user: User) => {
    toast.success(
      `Password reset email sent to ${user.email}.`,
    );
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    if (user) {
      toast.success(
        `${user.name} has been deleted successfully.`,
      );
    }
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
      user.email
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Workloads"
            value={totalUsers.toString()}
            subtitle="Currently deployed workloads"
            valueColor="text-gray-900"
          />
          <StatCard
            title="Deployed Users"
            value={activeUsers.toString()}
            subtitle="Total users"
            valueColor="text-green-600"
          />
          <StatCard
            title="1P Workloads"
            value= "5"
            subtitle="Microsoft applications"
            valueColor="text-blue-600"
          />
          <StatCard
            title="3P Workloads"
            value= "3"
            subtitle="Custom applications"
            valueColor="text-purple-600"
          />
        </div>

        {/* User Directory Section - Full Height */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg text-gray-900 mb-2">
              User Directory
            </h2>
            <p className="text-gray-600">
              Search and filter system users (
              {filteredUsers.length} users)
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by workload name or email..."
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
                <SelectItem value="teacher">
                  Clusters
                </SelectItem>
                <SelectItem value="student">VMs</SelectItem>
                <SelectItem value="admin">K8s</SelectItem>
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