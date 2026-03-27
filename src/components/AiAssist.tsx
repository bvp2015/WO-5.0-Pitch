import React, { useState } from 'react';

interface AiAssistProps {
  onNavigate: (page: string) => void;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const aiResponses: Record<string, string> = {
  'Why is my Nginx deployment failing?':
    'Based on my analysis, the Nginx Ingress v1.1.0 deployment may be failing due to:\n\n1. **Port conflict** — Port 80 or 443 may already be in use by another service on the target node.\n2. **Resource limits** — The pod is requesting 512Mi memory but the node only has 256Mi available.\n3. **Image pull error** — The container registry credentials may have expired.\n\n**Recommended fix:** Check pod events with `kubectl describe pod <nginx-pod>` and verify resource availability with `kubectl top nodes`. Also ensure your image pull secret is up to date.\n\n→ [[View Nginx deployment in Workloads|user-management]]',
  'Optimize storage utilization':
    'Here are my recommendations to optimize storage across your fleet:\n\n1. **Prometheus (50% utilization)** — Reduce data retention from 30 days to 15 days to free ~25% storage.\n2. **Grafana instances** — Two Grafana deployments on K8s clusters share identical dashboards. Consolidate into one instance to save ~2 GB.\n3. **InfluxDB** — Enable compression on the TSM engine to reduce disk usage by ~30%.\n4. **General** — Implement PVC auto-resize policies to prevent over-provisioning.\n\nEstimated savings: **~18% reduction** in total storage consumption.\n\n→ [[View storage utilization in Workloads|user-management]]',
  'Deploy my workloads on my cluster abc to cluster xyz':
    'To migrate workloads from **Cluster ABC** to **Cluster XYZ**, here\'s the recommended approach:\n\n1. **Pre-check** — Verify Cluster XYZ has sufficient resources (CPU: 8 cores available, Memory: 16 GB free).\n2. **Export manifests** — Run `kubectl get deployments -o yaml > workloads.yaml` on Cluster ABC.\n3. **Adjust configurations** — Update any cluster-specific ConfigMaps, Secrets, and PVC storage classes.\n4. **Apply to target** — Deploy with `kubectl apply -f workloads.yaml` on Cluster XYZ.\n5. **Validate** — Run health checks and verify all pods are in Running state.\n\nWould you like me to generate the migration script for you?\n\n→ [[View your workloads|user-management]]  ·  [[Browse Marketplace for tools|marketplace]]',
  'Can i bring my kafka workload to VM - abc':
    'Yes, you can deploy Apache Kafka on **VM-abc**. Here\'s what you need:\n\n**Requirements for VM-abc:**\n- Minimum 4 vCPUs and 8 GB RAM (VM-abc has 8 vCPUs, 16 GB — ✅ sufficient)\n- Java 11+ runtime installed\n- Ports 9092 (broker) and 2181 (ZooKeeper) available\n- At least 50 GB disk for log retention\n\n**Deployment steps:**\n1. Install Java runtime on VM-abc\n2. Download and extract Kafka binary distribution\n3. Configure `server.properties` with broker ID and log directory\n4. Start ZooKeeper, then Kafka broker\n5. Verify with `kafka-topics.sh --list`\n\nAlternatively, you can use the **Marketplace** to deploy a containerized Kafka with one click. Would you like me to set that up?\n\n→ [[Find Kafka in Marketplace|marketplace]]  ·  [[View VM workloads|user-management]]',
};

const defaultResponse = 'I\'m analyzing your request. Based on the current workload data across your fleet, I can see 8 workloads deployed across VMs and K8s clusters. Could you provide more details about what you\'d like to know? I can help with deployment troubleshooting, resource optimization, security recommendations, and migration planning.\n\n→ [[Go to Workloads|user-management]]  ·  [[Browse Marketplace|marketplace]]';

export function AiAssist({ onNavigate }: AiAssistProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    const aiReply = aiResponses[userMsg] || defaultResponse;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: userMsg },
      { role: 'ai', text: aiReply },
    ]);
    setChatInput('');
  };

  const handlePillClick = (query: string) => {
    setChatInput(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const suggestedQueries = [
    'Why is my Nginx deployment failing?',
    'Optimize storage utilization',
    'Deploy my workloads on my cluster abc to cluster xyz',
    'Can i bring my kafka workload to VM - abc',
  ];

  return (
    <div className="flex-1 bg-gray-50 h-full flex flex-col">
      {/* Messages area */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl font-bold">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">AI Assist</h1>
            <p className="text-gray-500 text-sm">Ask anything about your workloads</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  {msg.role === 'ai' ? (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.text.split(/(\*\*.*?\*\*|\[\[.*?\]\])/).map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith('[[') && part.endsWith(']]')) {
                          const inner = part.slice(2, -2);
                          const [label, route] = inner.split('|');
                          return (
                            <button
                              key={j}
                              onClick={() => onNavigate(route)}
                              className="inline text-purple-600 underline hover:text-purple-800 font-medium cursor-pointer bg-transparent border-none p-0 text-sm"
                            >
                              {label}
                            </button>
                          );
                        }
                        return <span key={j}>{part}</span>;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested queries + Chat bar */}
      <div className="p-6 pt-0">
          <div className="flex flex-wrap gap-2 mb-3 justify-center">
            {suggestedQueries.map((query) => (
              <button
                key={query}
                onClick={() => handlePillClick(query)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 cursor-pointer transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your workloads..."
            className="flex-1 h-11 rounded-lg border border-gray-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
          <button
            onClick={handleSend}
            className="h-11 px-5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium cursor-pointer shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
