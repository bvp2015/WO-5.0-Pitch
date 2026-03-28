import React, { useState } from 'react';
import { Search, Plus, Database, Cloud, Server, Container, Globe, Cpu, HardDrive, Network, Monitor, Boxes, LayoutGrid, Cog, ArrowLeft, CheckCircle, AlertTriangle, BookOpen, Upload, GitBranch, Settings, Rocket, Sparkles, X, Trash2 } from 'lucide-react';
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

interface AppDetail {
  overview: string;
  installationRequirements: string[];
  documentation: string[];
}

const appDetails: Record<string, AppDetail> = {
  m365: {
    overview: 'Microsoft 365 is a comprehensive productivity suite that includes Office applications (Word, Excel, PowerPoint), collaboration tools (Teams, SharePoint), and cloud services (OneDrive, Exchange Online). It provides enterprise-grade security, compliance, and management capabilities.',
    installationRequirements: [
      'Azure Active Directory tenant with valid M365 licenses',
      'Minimum 4 vCPUs and 8 GB RAM per node',
      'Network connectivity to Microsoft 365 endpoints (port 443)',
      'TLS 1.2 or higher enabled on all endpoints',
      'DNS resolution for *.office.com and *.microsoft.com domains',
      'At least 50 GB available disk space for local cache',
    ],
    documentation: [
      'Microsoft 365 deployment guide — Plan your enterprise deployment including network requirements, identity configuration, and client deployment strategies.',
      'Conditional Access policies — Configure security policies to protect access to M365 resources based on user, device, location, and risk signals.',
      'Teams administration — Manage Teams settings, policies, and configurations for your organization including meeting policies and messaging settings.',
      'Exchange Online setup — Configure mail flow, anti-spam policies, and mailbox management for your organization.',
    ],
  },
  foundry: {
    overview: 'Microsoft Foundry is a unified data platform designed for analytics and AI workloads at scale. It provides integrated tools for data ingestion, transformation, and machine learning model deployment, enabling organizations to build intelligent applications.',
    installationRequirements: [
      'Kubernetes cluster v1.25 or higher with RBAC enabled',
      'Minimum 8 vCPUs and 32 GB RAM for control plane nodes',
      'Persistent storage class with at least 500 GB capacity',
      'Azure Arc-enabled infrastructure for hybrid deployments',
      'Helm v3.10+ installed for chart deployment',
      'Network policies allowing egress to Azure AI services',
    ],
    documentation: [
      'Foundry architecture overview — Understand the core components including data connectors, processing pipeline, model registry, and serving infrastructure.',
      'Data pipeline configuration — Set up automated data ingestion from various sources including IoT devices, databases, and streaming platforms.',
      'Model training and deployment — Train ML models using integrated notebooks and deploy them as scalable REST endpoints.',
      'Monitoring and observability — Configure dashboards and alerts for pipeline health, model performance, and resource utilization.',
    ],
  },
  avd: {
    overview: 'Azure Virtual Desktop (AVD) is a cloud-based desktop and application virtualization service. It enables secure remote work by delivering full desktop experiences or individual applications to users on any device, with enterprise-grade security and management.',
    installationRequirements: [
      'Azure subscription with AVD resource provider registered',
      'Azure AD joined or hybrid AD joined host pool VMs',
      'Minimum 4 vCPUs and 8 GB RAM per session host',
      'Outbound internet access for AVD agent communication',
      'FSLogix profile container storage (Azure Files or Azure NetApp Files)',
      'RDP shortpath or gateway connectivity configured',
    ],
    documentation: [
      'Host pool deployment — Create and configure host pools with appropriate VM sizes, scaling plans, and load-balancing algorithms.',
      'User profile management — Set up FSLogix profile containers for seamless roaming user profiles across session hosts.',
      'Security and compliance — Implement conditional access, MFA, and screen capture protection for virtual desktop sessions.',
      'Performance optimization — Configure GPU acceleration, multimedia redirection, and network optimization for best user experience.',
    ],
  },
  aio: {
    overview: 'Azure IoT Operations (AIO) is an end-to-end IoT solution that bridges edge and cloud workloads. It provides data collection from industrial devices, edge processing, and cloud analytics to enable digital transformation of operational technology environments.',
    installationRequirements: [
      'Azure Arc-enabled Kubernetes cluster at the edge',
      'Minimum 4 vCPUs and 16 GB RAM for edge gateway nodes',
      'OPC UA or MQTT broker connectivity to industrial devices',
      'Azure IoT Hub or Event Hub namespace provisioned',
      'TLS certificates for secure device-to-cloud communication',
      'Storage class with at least 100 GB for local data buffering',
    ],
    documentation: [
      'Edge deployment guide — Deploy AIO components to Arc-enabled Kubernetes clusters including the data processor, OPC UA broker, and MQ.',
      'Device connectivity — Configure connections to industrial equipment using OPC UA, MQTT, or custom protocol adapters.',
      'Data pipeline rules — Set up data transformation, filtering, and enrichment rules for processing telemetry at the edge before cloud sync.',
      'Integration with Fabric — Route processed IoT data to Microsoft Fabric for advanced analytics, dashboards, and AI/ML workloads.',
    ],
  },
  postgres: {
    overview: 'PostgreSQL is an advanced open-source relational database system known for reliability, feature robustness, and performance. It supports SQL compliance, complex queries, triggers, and a wide range of data types.',
    installationRequirements: ['Minimum 2 vCPUs and 4 GB RAM', 'Persistent volume with at least 20 GB storage', 'PostgreSQL client libraries installed', 'Network port 5432 available'],
    documentation: ['Database configuration — Set up connection pooling, replication, and backup strategies.', 'Performance tuning — Optimize query performance with proper indexing and configuration.'],
  },
  mongodb: {
    overview: 'MongoDB is a NoSQL document database designed for modern application development. It provides a flexible schema model, horizontal scaling, and a powerful query language.',
    installationRequirements: ['Minimum 2 vCPUs and 4 GB RAM per replica', 'WiredTiger storage engine recommended', 'Network port 27017 available', 'At least 10 GB disk space'],
    documentation: ['Replica set configuration — Set up high availability with replica sets.', 'Sharding guide — Scale horizontally by distributing data across shards.'],
  },
  redis: {
    overview: 'Redis is an in-memory data structure store used as a database, cache, message broker, and streaming engine.',
    installationRequirements: ['Minimum 1 vCPU and 2 GB RAM', 'Network port 6379 available', 'Persistence storage for RDB/AOF backups'],
    documentation: ['Cluster setup — Configure Redis Cluster for automatic sharding.', 'Persistence configuration — Choose between RDB snapshots and AOF logging.'],
  },
  elasticsearch: {
    overview: 'Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It provides near real-time search and analytics for all types of data.',
    installationRequirements: ['Minimum 4 vCPUs and 8 GB RAM per node', 'Java 17 or later', 'At least 50 GB storage per node', 'Network ports 9200 and 9300 available'],
    documentation: ['Index management — Configure index lifecycle policies and mappings.', 'Cluster scaling — Add nodes and configure shard allocation.'],
  },
  kubernetes: {
    overview: 'Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.',
    installationRequirements: ['Minimum 2 vCPUs and 4 GB RAM per node', 'Container runtime (containerd, CRI-O)', 'Network plugin (Calico, Flannel, Cilium)', 'kubectl CLI installed'],
    documentation: ['Cluster setup — Initialize and configure a production-ready cluster.', 'Workload management — Deploy and manage pods, deployments, and services.'],
  },
  docker: {
    overview: 'Docker is a platform for building, shipping, and running applications in containers, providing OS-level virtualization.',
    installationRequirements: ['Minimum 2 vCPUs and 2 GB RAM', 'Linux kernel 3.10 or higher', '20 GB available disk space', 'Network access to container registries'],
    documentation: ['Image management — Build, tag, and push container images.', 'Networking — Configure bridge, overlay, and host networking modes.'],
  },
  nodejs: {
    overview: 'Node.js is a JavaScript runtime built on Chrome V8 engine that enables server-side JavaScript execution for scalable network applications.',
    installationRequirements: ['Minimum 1 vCPU and 1 GB RAM', 'npm or yarn package manager', 'Network access for package installation'],
    documentation: ['Runtime configuration — Set up environment variables and process management.', 'Package management — Manage dependencies with npm or yarn.'],
  },
  python: {
    overview: 'Python is a versatile, high-level programming language runtime used for web development, data science, automation, and AI/ML applications.',
    installationRequirements: ['Minimum 1 vCPU and 1 GB RAM', 'pip package manager', 'Virtual environment support (venv or conda)'],
    documentation: ['Environment setup — Configure virtual environments and dependency management.', 'Package installation — Install and manage Python packages with pip.'],
  },
  nginx: {
    overview: 'NGINX is a high-performance web server, reverse proxy, and load balancer known for its stability, rich feature set, and low resource consumption.',
    installationRequirements: ['Minimum 1 vCPU and 512 MB RAM', 'Network ports 80 and 443 available', 'TLS certificates for HTTPS'],
    documentation: ['Reverse proxy setup — Configure upstream servers and load balancing.', 'SSL/TLS — Set up HTTPS with certificate management.'],
  },
  cloudflare: {
    overview: 'Cloudflare Workers provides a serverless execution environment at the edge, enabling low-latency application logic close to users worldwide.',
    installationRequirements: ['Cloudflare account with Workers plan', 'Wrangler CLI installed', 'Node.js 16+ for local development'],
    documentation: ['Worker deployment — Deploy serverless functions to edge locations.', 'KV storage — Use Workers KV for distributed key-value storage.'],
  },
  traefik: {
    overview: 'Traefik is a modern HTTP reverse proxy and load balancer that integrates with container orchestrators for automatic service discovery.',
    installationRequirements: ['Minimum 1 vCPU and 512 MB RAM', 'Network ports 80 and 443 available', 'Docker or Kubernetes for service discovery'],
    documentation: ['Router configuration — Set up routing rules and middleware.', 'Auto-discovery — Configure providers for Docker, Kubernetes, or Consul.'],
  },
  minio: {
    overview: 'MinIO is a high-performance, S3-compatible object storage system designed for large-scale AI/ML, data lake, and backup workloads.',
    installationRequirements: ['Minimum 4 vCPUs and 8 GB RAM', 'At least 4 drives for erasure coding', 'Network port 9000 available'],
    documentation: ['Bucket management — Create and configure buckets with versioning and lifecycle policies.', 'Erasure coding — Set up data redundancy and self-healing storage.'],
  },
  nfs: {
    overview: 'NFS (Network File System) provides distributed file access allowing clients to access files over the network as if they were local.',
    installationRequirements: ['Linux kernel with NFS support', 'Network ports 111 and 2049 available', 'Sufficient disk space for shared volumes'],
    documentation: ['Export configuration — Set up NFS exports and access control.', 'Performance tuning — Optimize read/write performance for network file access.'],
  },
  ceph: {
    overview: 'Ceph is a unified, distributed storage system providing object, block, and file storage in a single platform with no single point of failure.',
    installationRequirements: ['Minimum 3 nodes for high availability', '4 vCPUs and 16 GB RAM per OSD node', 'Dedicated OSD drives (SSD recommended)', 'Network ports 6789, 6800-7300 available'],
    documentation: ['Cluster deployment — Deploy monitors, OSDs, and managers.', 'Pool management — Configure CRUSH rules and replication factors.'],
  },
  apache: {
    overview: 'Apache HTTP Server is the world\'s most used web server software, providing a secure, efficient, and extensible server for HTTP services.',
    installationRequirements: ['Minimum 1 vCPU and 512 MB RAM', 'Network ports 80 and 443 available', 'OpenSSL for TLS support'],
    documentation: ['Virtual hosts — Configure name-based and IP-based virtual hosting.', 'Module management — Enable and configure Apache modules.'],
  },
  tomcat: {
    overview: 'Apache Tomcat is an open-source Java servlet container implementing Jakarta Servlet, Jakarta Server Pages, and WebSocket specifications.',
    installationRequirements: ['Java 11 or later', 'Minimum 2 vCPUs and 2 GB RAM', 'Network port 8080 available', 'At least 5 GB disk space'],
    documentation: ['Application deployment — Deploy WAR files and configure contexts.', 'Connection pooling — Set up JDBC connection pools for database access.'],
  },
};

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

interface MarketplaceProps {
  onNavigate?: (page: string) => void;
}

export function Marketplace({ onNavigate }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<{ id: string; name: string; description: string; icon: React.ElementType; version: string; provider: string; category: string } | null>(null);
  const [showAddWorkload, setShowAddWorkload] = useState(false);
  const [deployApp, setDeployApp] = useState<{ name: string; version: string } | null>(null);
  const [vms, setVms] = useState<string[]>(['']);
  const [k8sClusters, setK8sClusters] = useState<string[]>(['']);
  const [deployNamespace, setDeployNamespace] = useState('default');
  const [replicas, setReplicas] = useState('1');
  const [resourceProfile, setResourceProfile] = useState('standard');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const openDeployPanel = (appName: string, appVersion: string) => {
    setDeployApp({ name: appName, version: appVersion });
    setVms(['']);
    setK8sClusters(['']);
    setDeployNamespace('default');
    setReplicas('1');
    setResourceProfile('standard');
    setDeploying(false);
    setDeployed(false);
  };

  const closeDeployPanel = () => {
    setDeployApp(null);
  };

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
    }, 2000);
  };

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
        {/* Add Workload View */}
        {showAddWorkload ? (
          <>
            <button
              onClick={() => setShowAddWorkload(false)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </button>

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Your Workload</h1>
              <p className="text-gray-600">Upload your own workload or connect to a Git repository to deploy on your target infrastructure</p>
            </div>

            {/* Deployment Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Upload Workload */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Upload Workload Package</h2>
                </div>
                <p className="text-gray-600 mb-4">Upload a Helm chart, Docker Compose file, or Kubernetes manifest to deploy your workload directly.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Supports Helm charts (.tgz), Docker Compose, and K8s manifests
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Automatic validation of deployment configurations
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Version management and rollback support
                  </li>
                </ul>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Drag and drop your workload package here</p>
                  <p className="text-xs text-gray-400 mb-3">or</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
              </div>

              {/* Link to Git */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <GitBranch className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Connect Git Repository</h2>
                </div>
                <p className="text-gray-600 mb-4">Link your Git repository for GitOps-based continuous deployment to your fleet infrastructure.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Supports GitHub, Azure DevOps, GitLab, and Bitbucket
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Auto-deploy on push with configurable branch triggers
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Built-in CI/CD pipeline with status monitoring
                  </li>
                </ul>
                <div className="space-y-3">
                  <Input placeholder="https://github.com/your-org/your-repo" className="bg-gray-50 border-gray-200" />
                  <div className="flex gap-2">
                    <Input placeholder="Branch (default: main)" className="bg-gray-50 border-gray-200" />
                    <Input placeholder="Path to manifest" className="bg-gray-50 border-gray-200" />
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Connect Repository
                  </Button>
                </div>
              </div>
            </div>

            {/* Deployment Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Deployment Configuration</h2>
              </div>
              <p className="text-gray-600 mb-4">Configure your target infrastructure and deployment settings before deploying your workload.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workload Name</label>
                  <Input placeholder="my-custom-workload" className="bg-gray-50 border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <Input placeholder="1.0.0" className="bg-gray-50 border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Infrastructure</label>
                  <select className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm">
                    <option>Select infrastructure...</option>
                    <option>Kubernetes Clusters</option>
                    <option>Virtual Machines</option>
                    <option>Azure Arc-enabled servers</option>
                    <option>Edge devices</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Namespace</label>
                  <Input placeholder="default" className="bg-gray-50 border-gray-200" />
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">How It Works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Upload or Connect', desc: 'Upload your workload package or connect your Git repository with deployment manifests.' },
                  { step: '2', title: 'Configure', desc: 'Select your target infrastructure, set namespace, and configure deployment parameters.' },
                  { step: '3', title: 'Validate', desc: 'Automated checks verify compatibility, resource requirements, and security policies.' },
                  { step: '4', title: 'Deploy', desc: 'One-click deployment to your selected infrastructure with real-time status monitoring.' },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-700 font-bold">{item.step}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : selectedApp ? (() => {
          const Icon = selectedApp.icon;
          const details = appDetails[selectedApp.id];
          return (
            <>
              {/* Back Button */}
              <button
                onClick={() => setSelectedApp(null)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </button>

              {/* App Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedApp.name}</h1>
                      <p className="text-gray-600 mb-2">{selectedApp.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Version: {selectedApp.version}</span>
                        <span>Provider: {selectedApp.provider}</span>
                        <span>Category: {selectedApp.category}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={(e) => { e.stopPropagation(); openDeployPanel(selectedApp.name, selectedApp.version); }}>
                    Deploy
                  </Button>
                </div>
              </div>

              {/* Overview */}
              {details && (
                <>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg font-bold text-gray-900">Overview</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{details.overview}</p>
                  </div>

                  {/* Installation Requirements */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <h2 className="text-lg font-bold text-gray-900">Installation Requirements</h2>
                    </div>
                    <ul className="space-y-3">
                      {details.installationRequirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documentation */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <h2 className="text-lg font-bold text-gray-900">Documentation & Learn Resources</h2>
                    </div>
                    <div className="space-y-4">
                      {details.documentation.map((doc, index) => {
                        const [title, ...rest] = doc.split(' — ');
                        const description = rest.join(' — ');
                        return (
                          <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                            {description && <p className="text-sm text-gray-600">{description}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          );
        })() : (
        <>
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-white mb-2">Add Your 3P Workloads Too</h2>
              <p className="text-blue-100">Integrate third-party workloads seamlessly into your fleet</p>
            </div>
            <Button onClick={() => setShowAddWorkload(true)} className="bg-white text-blue-600 hover:bg-blue-50">
              <Plus className="w-4 h-4 mr-2" />
              Add Workload
            </Button>
          </div>
        </div>

        {/* AI Assist Banner */}
        <div
          onClick={() => onNavigate?.('ai-assist')}
          className="bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg px-4 py-2.5 mb-6 cursor-pointer hover:from-purple-150 hover:to-indigo-150 hover:border-purple-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">Need help with workloads?</span>
            </div>
            <span className="text-purple-700 text-sm font-medium bg-purple-200/50 px-3 py-1 rounded-md">Try AI Assist &rarr;</span>
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

        {/* First Party Apps */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">First Party Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { id: 'm365', name: 'Microsoft 365', description: 'Productivity suite with Office apps, Teams, and cloud services', icon: LayoutGrid, version: 'Latest', provider: 'Microsoft' },
              { id: 'foundry', name: 'Foundry', description: 'Unified data platform for analytics and AI workloads', icon: Boxes, version: 'v1.0', provider: 'Microsoft' },
              { id: 'avd', name: 'Azure Virtual Desktop', description: 'Cloud-based desktop and app virtualization service', icon: Monitor, version: 'Latest', provider: 'Microsoft' },
              { id: 'aio', name: 'Azure IoT Operations', description: 'End-to-end IoT solution for edge and cloud workloads', icon: Cog, version: 'v1.0', provider: 'Microsoft' },
            ].map((app) => {
              const Icon = app.icon;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp({ ...app, category: 'First Party Apps' })}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {app.version}
                    </span>
                  </div>
                  <h3 className="text-base text-gray-900 mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{app.provider}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8"
                      onClick={(e) => { e.stopPropagation(); openDeployPanel(app.name, app.version); }}
                    >
                      Deploy
                    </Button>
                  </div>
                </div>
              );
            })}
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
                    onClick={() => setSelectedApp(workload)}
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
                        onClick={(e) => { e.stopPropagation(); openDeployPanel(workload.name, workload.version); }}
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
        </>
        )}
      </div>

      {/* Deploy Side Panel */}
      {deployApp && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDeployPanel} />
          <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Deploy {deployApp.name}</h2>
                <p className="text-sm text-gray-500">Version {deployApp.version}</p>
              </div>
              <button onClick={closeDeployPanel} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {deployed ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Deployment Initiated!</h3>
                  <p className="text-gray-600 mb-6">{deployApp.name} is being deployed to your selected infrastructure. You can monitor progress from the Workloads page.</p>
                  <div className="flex gap-3">
                    <Button onClick={closeDeployPanel} variant="outline">Close</Button>
                    <Button onClick={() => { closeDeployPanel(); onNavigate?.('user-management'); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Go to Workloads
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Target VMs */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-blue-600" />
                        Virtual Machines
                      </label>
                      <button
                        onClick={() => setVms([...vms, ''])}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        + Add VM
                      </button>
                    </div>
                    <div className="space-y-2">
                      {vms.map((vm, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={vm}
                            onChange={(e) => { const updated = [...vms]; updated[i] = e.target.value; setVms(updated); }}
                            placeholder={`VM name (e.g., vm-prod-${i + 1})`}
                            className="bg-gray-50 border-gray-200 text-sm"
                          />
                          {vms.length > 1 && (
                            <button
                              onClick={() => setVms(vms.filter((_, j) => j !== i))}
                              className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Target K8s Clusters */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Container className="w-4 h-4 text-purple-600" />
                        Kubernetes Clusters
                      </label>
                      <button
                        onClick={() => setK8sClusters([...k8sClusters, ''])}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        + Add Cluster
                      </button>
                    </div>
                    <div className="space-y-2">
                      {k8sClusters.map((cluster, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={cluster}
                            onChange={(e) => { const updated = [...k8sClusters]; updated[i] = e.target.value; setK8sClusters(updated); }}
                            placeholder={`Cluster name (e.g., k8s-prod-${i + 1})`}
                            className="bg-gray-50 border-gray-200 text-sm"
                          />
                          {k8sClusters.length > 1 && (
                            <button
                              onClick={() => setK8sClusters(k8sClusters.filter((_, j) => j !== i))}
                              className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuration */}
                  <div>
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <Settings className="w-4 h-4 text-gray-600" />
                      Configuration
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Namespace</label>
                        <Input
                          value={deployNamespace}
                          onChange={(e) => setDeployNamespace(e.target.value)}
                          placeholder="default"
                          className="bg-gray-50 border-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Replicas</label>
                        <Input
                          type="number"
                          min="1"
                          value={replicas}
                          onChange={(e) => setReplicas(e.target.value)}
                          className="bg-gray-50 border-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Resource Profile</label>
                        <select
                          value={resourceProfile}
                          onChange={(e) => setResourceProfile(e.target.value)}
                          className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm"
                        >
                          <option value="minimal">Minimal (1 vCPU, 1 GB RAM)</option>
                          <option value="standard">Standard (2 vCPU, 4 GB RAM)</option>
                          <option value="performance">Performance (4 vCPU, 8 GB RAM)</option>
                          <option value="high">High (8 vCPU, 16 GB RAM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Deployment Summary</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>VMs: {vms.filter(v => v.trim()).length || 'None selected'}</p>
                      <p>K8s Clusters: {k8sClusters.filter(c => c.trim()).length || 'None selected'}</p>
                      <p>Namespace: {deployNamespace || 'default'}</p>
                      <p>Replicas: {replicas}</p>
                      <p>Profile: {resourceProfile}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Panel Footer */}
            {!deployed && (
              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <Button onClick={closeDeployPanel} variant="outline" className="flex-1">Cancel</Button>
                <Button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {deploying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deploying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Deploy
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
