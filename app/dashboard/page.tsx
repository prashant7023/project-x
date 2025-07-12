'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { ProductsTab } from '@/components/dashboard/products-tab';
import { AnalyticsTab } from '@/components/dashboard/analytics-tab';
import { ProfileTab } from '@/components/dashboard/profile-tab';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut } from 'lucide-react';
import ProtectedRoute from '@/components/protected-route';
import { removeAuthToken, redirectToLogin } from '@/lib/auth-utils';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
    fetchProducts();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { apiClient } = await import('@/lib/api-client');
      if (!apiClient.isAuthenticated()) {
        router.push('/');
        return;
      }
      
      const response = await apiClient.getUserProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Authentication check failed:', error);
      router.push('/');
    }
  };

  const handleLogout = async () => {
    try {
      const { apiClient } = await import('@/lib/api-client');
      await apiClient.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear token and redirect, even if API call fails
      removeAuthToken();
      redirectToLogin();
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { apiClient } = await import('@/lib/api-client');
      const response = await apiClient.getProducts({ limit: 100 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to direct API call if backend is not available
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        setProducts(data.products);
      } catch (fallbackError) {
        console.error('Error fetching products from fallback:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 shadow-lg dark:shadow-zinc-950/50 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:flex bg-white dark:bg-zinc-900 shadow-sm border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
            {user && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Welcome back, {user.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto bg-zinc-50 dark:bg-zinc-900">
          {activeTab === 'products' && (
            <ProductsTab products={products} loading={loading} onRefresh={fetchProducts} />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab products={products} loading={loading} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab user={user} loading={loading} />
          )}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}