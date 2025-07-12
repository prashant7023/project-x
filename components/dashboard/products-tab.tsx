'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Package, 
  Star, 
  DollarSign,
  TrendingUp,
  X,
  ShoppingCart
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

interface ProductsTabProps {
  products: Product[];
  loading: boolean;
  onRefresh: () => void;
}

export function ProductsTab({ products, loading, onRefresh }: ProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / totalProducts;
    const averageRating = products.reduce((sum, p) => sum + p.rating, 0) / totalProducts;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalProducts,
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

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-100 text-green-800';
    if (rating >= 4.0) return 'bg-blue-100 text-blue-800';
    if (rating >= 3.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 20) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Products</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Manage and view your product catalog</p>
        </div>
        <Button onClick={onRefresh} className="gap-2 self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Products</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Average Price</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{formatPrice(stats.averagePrice)}</p>
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
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Average Rating</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.averageRating.toFixed(1)}</p>
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
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Stock</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalStock.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                <Input
                  placeholder="Search products, brands, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow 
                      key={product.id} 
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors duration-200"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <TableCell>
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                            {product.title}
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                            {product.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.brand}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatPrice(product.price)}</p>
                          {product.discountPercentage > 0 && (
                            <p className="text-sm text-green-600">
                              -{product.discountPercentage}% off
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRatingColor(product.rating)}>
                          <Star className="w-3 h-3 mr-1" />
                          {product.rating}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.stock}</TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={() => setSelectedProduct(null)}
        >
          <Card 
            className="w-full max-w-6xl max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 border-b p-2">
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="p-6 space-y-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-xl">
                        <img
                          src={image}
                          alt={`${selectedProduct.title} ${index + 1}`}
                          className="w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Price</p>
                      </div>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {formatPrice(selectedProduct.price)}
                      </p>
                      {selectedProduct.discountPercentage > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          -{selectedProduct.discountPercentage}% off
                        </p>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Rating</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          {selectedProduct.rating}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(selectedProduct.rating)
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-zinc-300 dark:text-zinc-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Stock</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {selectedProduct.stock}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">units available</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Discount</p>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {selectedProduct.discountPercentage}%
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">savings</p>
                    </div>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Availability</h3>
                  <div className="flex items-center gap-3">
                    <Badge className={getStockStatus(selectedProduct.stock).color + " text-sm px-3 py-1"}>
                      {getStockStatus(selectedProduct.stock).label}
                    </Badge>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Product Information</h3>
                  <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700 p-4 rounded-xl border border-zinc-200 dark:border-zinc-600">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {selectedProduct.title}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                      {selectedProduct.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">
                        {selectedProduct.category}
                      </Badge>
                      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                        by {selectedProduct.brand}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}