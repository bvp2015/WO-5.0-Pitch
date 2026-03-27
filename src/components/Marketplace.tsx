import React, { useState } from 'react';
import { Search, Plus, Database, Cloud, Server, Container, Globe, Cpu, HardDrive, Network } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface WorkloadTile {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  version: string;
  provider: string;
}

const workloads: WorkloadTile[] = [
  // Data & Analytics
  {
    id: 'postgres',
    name: 'PostgreSQL',
    description: 'Advanced open-source relational database',
    icon: Database,
    category: 'Data & Analytics',
    version: 'v15.2',
    provider: 'Official'
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'NoSQL document database for modern apps',
    icon: Database,
    category: 'Data & Analytics',
    version: 'v7.0',
    provider: 'Official'
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory data structure store',
    icon: Database,
    category: 'Data & Analytics',
    version: 'v7.2',
    provider: 'Official'
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    description: 'Distributed search and analytics engine',
    icon: Database,
    category: 'Data & Analytics',
    version: 'v8.11',
    provider: 'Elastic'
  },

  // Compute & Runtime
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    description: 'Container orchestration platform',
    icon: Container,
    category: 'Compute & Runtime',
    version: 'v1.28',
    provider: 'CNCF'
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Container runtime environment',
    icon: Container,
    category: 'Compute & Runtime',
    version: 'v24.0',
    provider: 'Docker Inc'
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    description: 'JavaScript runtime built on Chrome V8',
    icon: Cpu,
    category: 'Compute & Runtime',
    version: 'v20.10',
    provider: 'OpenJS'
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Versatile programming language runtime',
    icon: Cpu,
    category: 'Compute & Runtime',
    version: 'v3.12',
    provider: 'PSF'
  },

  // Networking & CDN
  {
    id: 'nginx',
    name: 'NGINX',
    description: 'High-performance web server and reverse proxy',
    icon: Network,
    category: 'Networking & CDN',
    version: 'v1.25',
    provider: 'F5'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers',
    description: 'Serverless execution at the edge',
    icon: Cloud,
    category: 'Networking & CDN',
    version: 'Latest',
    provider: 'Cloudflare'
  },
  {
    id: 'traefik',
    name: 'Traefik',
    description: 'Modern HTTP reverse proxy and load balancer',
    icon: Network,
    category: 'Networking & CDN',
    version: 'v2.10',
    provider: 'Traefik Labs'
  },

  // Storage & Backup
  {
    id: 'minio',
    name: 'MinIO',
    description: 'High-performance object storage',
    icon: HardDrive,
    category: 'Storage & Backup',
    version: 'Latest',
    provider: 'MinIO'
  },
  {
    id: 'nfs',
    name: 'NFS Server',
    description: 'Network file system for distributed access',
    icon: HardDrive,
    category: 'Storage & Backup',
    version: 'v4.2',
    provider: 'Linux'
  },
  {
    id: 'ceph',
    name: 'Ceph',
    description: 'Unified distributed storage system',
    icon: Server,
    category: 'Storage & Backup',
    version: 'v18.0',
    provider: 'Red Hat'
  },

  // Web & Application
  {
    id: 'apache',
    name: 'Apache HTTP Server',
    description: 'Open-source HTTP server',
    icon: Globe,
    category: 'Web & Application',
    version: 'v2.4',
    provider: 'ASF'
  },
  {
    id: 'tomcat',
    name: 'Apache Tomcat',
    description: 'Java servlet container',
    icon: Server,
    category: 'Web & Application',
    version: 'v10.1',
    provider: 'ASF'
  },
];

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter workloads based on search
  const filteredWorkloads = workloads.filter(workload => 
    workload.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workload.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workload.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group workloads by category
  const workloadsByCategory = filteredWorkloads.reduce((acc, workload) => {
    if (!acc[workload.category]) {
      acc[workload.category] = [];
    }
    acc[workload.category].push(workload);
    return acc;
  }, {} as Record<string, WorkloadTile[]>);

  return (
    <div className="flex-1 bg-gray-50 h-full overflow-auto">
      <div className="p-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-white mb-2">Add Your 3P Workloads Too</h2>
              <p className="text-blue-100">Integrate third-party workloads seamlessly into your fleet</p>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              Add Workload
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">Workload Marketplace</h1>
          <p className="text-gray-600">Discover and deploy workloads for your fleet</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search workloads by name, description, or category..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 bg-white border-gray-200 h-12"
            />
          </div>
        </div>

        {/* Workload Sections */}
        {Object.entries(workloadsByCategory).map(([category, categoryWorkloads]) => (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryWorkloads.map((workload) => {
                const Icon = workload.icon;
                return (
                  <div
                    key={workload.id}
                    className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {workload.version}
                      </span>
                    </div>
                    <h3 className="text-base text-gray-900 mb-2">{workload.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {workload.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">{workload.provider}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
                      >
                        Deploy
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* No Results */}
        {filteredWorkloads.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">No workloads found</h3>
            <p className="text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
