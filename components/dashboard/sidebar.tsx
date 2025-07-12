'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  BarChart3, 
  LogOut, 
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  closeSidebar: () => void;
}

const navigation = [
  { id: 'products', name: 'Products', icon: Package },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
];

const secondaryNavigation = [
  { id: 'profile', name: 'Profile', icon: User },
];

export function Sidebar({ activeTab, setActiveTab, closeSidebar }: SidebarProps) {
  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    closeSidebar();
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Product Management</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-12 text-left font-medium transition-all duration-200',
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
              onClick={() => handleNavClick(item.id)}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Button>
          ))}
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-700">
          <p className="px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
            Account
          </p>
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 h-12 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}