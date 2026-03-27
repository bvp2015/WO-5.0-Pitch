import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { UserManagement } from './components/UserManagement';
import { Marketplace } from './components/Marketplace';
import { AiAssist } from './components/AiAssist';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeMenuItem, setActiveMenuItem] = useState('user-management');

  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'user-management':
        return <UserManagement onNavigate={handleMenuItemClick} />;
      case 'marketplace':
        return <Marketplace onNavigate={handleMenuItemClick} />;
      case 'reports':
        return (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Problem statement</h1>
              <p className="text-gray-700 mb-4">
                Customers are facing two key challenges:

              </p>
              <p className="text-gray-700 mb-4">1.	Lack of visibility of the workloads deployed across their fleet
              </p>  
              <p className="text-gray-700 mb-4">2.	Lack of understanding on which workloads are supported, and how they can bring their workloads
              </p>
               <p className="text-gray-700 mb-4">The current UX prototype is to solve these problems.</p>
             </div>
          </div>
        );
      case 'ai-assist':
        return <AiAssist onNavigate={handleMenuItemClick} />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
      <Sidebar 
        activeItem={activeMenuItem} 
        onItemClick={handleMenuItemClick} 
      />
      {renderContent()}
      <Toaster />
    </div>
  );
}