'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Star,
  BarChart3,
  PieChart
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface AnalyticsTabProps {
  products: Product[];
  loading: boolean;
}

export function AnalyticsTab({ products, loading }: AnalyticsTabProps) {
  const analytics = useMemo(() => {
    if (!products.length) return null;

    // Category distribution
    const categoryData = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        percentage: ((value / products.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);

    // Price ranges
    const priceRanges = [
      { range: '$0-$50', min: 0, max: 50 },
      { range: '$50-$100', min: 50, max: 100 },
      { range: '$100-$500', min: 100, max: 500 },
      { range: '$500-$1000', min: 500, max: 1000 },
      { range: '$1000+', min: 1000, max: Infinity }
    ];

    const priceDistribution = priceRanges.map(range => ({
      range: range.range,
      count: products.filter(p => p.price >= range.min && p.price < range.max).length
    }));

    // Top brands
    const brandData = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topBrands = Object.entries(brandData)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Stock analysis
    const lowStockProducts = products.filter(p => p.stock < 20).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const highStockProducts = products.filter(p => p.stock >= 100).length;

    // Top performing products
    const topRatedProducts = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    const highestPricedProducts = [...products]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5);

    // Summary stats
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      categoryChartData,
      priceDistribution,
      topBrands,
      lowStockProducts,
      outOfStockProducts,
      highStockProducts,
      topRatedProducts,
      highestPricedProducts,
      totalValue,
      averagePrice,
      averageRating,
      totalStock
    };
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-zinc-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No data available for analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Analytics Dashboard</h1>
        <p className="text-zinc-600">Insights and trends from your product data</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Inventory Value</p>
                <p className="text-2xl font-bold text-zinc-900">{formatPrice(analytics.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600">Total Stock Units</p>
                <p className="text-2xl font-bold text-zinc-900">{analytics.totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600">Average Rating</p>
                <p className="text-2xl font-bold text-zinc-900">{analytics.averageRating.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600">Average Price</p>
                <p className="text-2xl font-bold text-zinc-900">{formatPrice(analytics.averagePrice)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-600" />
            <CardTitle>Product Categories</CardTitle>
          </div>
          <CardDescription>Distribution of products by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryChartData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-zinc-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: `hsl(${index * 45}, 70%, 50%)`,
                        width: `${category.percentage}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-zinc-600 w-16 text-right">
                    {category.value} ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Products</CardTitle>
            <CardDescription>Products with the highest ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topRatedProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-900 truncate">{product.title}</p>
                    <p className="text-sm text-zinc-500">{product.brand}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    {product.rating}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stock Status */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Analysis</CardTitle>
            <CardDescription>Current inventory status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">Low Stock Products</p>
                  <p className="text-2xl font-bold text-zinc-900">{analytics.lowStockProducts}</p>
                  <p className="text-sm text-red-600">Less than 20 units</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-zinc-900">{analytics.outOfStockProducts}</p>
                  <p className="text-sm text-zinc-600">No units available</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-600">High Stock Products</p>
                  <p className="text-2xl font-bold text-zinc-900">{analytics.highStockProducts}</p>
                  <p className="text-sm text-green-600">100+ units available</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
