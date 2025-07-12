const express = require('express');
const axios = require('axios');

const router = express.Router();

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache middleware
const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return res.json(cached.data);
  }
  
  next();
};

// GET /api/products
router.get('/', cacheMiddleware, async (req, res) => {
  try {
    const { limit = 100, skip = 0, category, search } = req.query;
    
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    
    if (category) {
      url = `https://dummyjson.com/products/category/${category}`;
    }
    
    if (search) {
      url = `https://dummyjson.com/products/search?q=${search}`;
    }
    
    const response = await axios.get(url);
    const data = response.data;
    
    // Add analytics data
    const analytics = {
      totalProducts: data.products.length,
      categories: [...new Set(data.products.map(p => p.category))],
      averagePrice: data.products.reduce((sum, p) => sum + p.price, 0) / data.products.length,
      averageRating: data.products.reduce((sum, p) => sum + p.rating, 0) / data.products.length,
      priceRange: {
        min: Math.min(...data.products.map(p => p.price)),
        max: Math.max(...data.products.map(p => p.price))
      }
    };
    
    const result = {
      success: true,
      data: {
        products: data.products,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
        analytics
      }
    };
    
    // Cache the result
    cache.set(req.originalUrl, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// GET /api/products/categories
router.get('/categories', cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/products/categories');
    const categories = response.data;
    
    const result = {
      success: true,
      data: categories
    };
    
    // Cache the result
    cache.set(req.originalUrl, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// GET /api/products/analytics
router.get('/analytics', cacheMiddleware, async (req, res) => {
  try {
    const response = await axios.get('https://dummyjson.com/products?limit=100');
    const products = response.data.products;
    
    // Category distribution
    const categoryCount = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    // Price range distribution
    const priceRanges = {
      'Under $50': 0,
      '$50-$100': 0,
      '$100-$500': 0,
      '$500-$1000': 0,
      'Over $1000': 0
    };
    
    products.forEach(product => {
      if (product.price < 50) priceRanges['Under $50']++;
      else if (product.price < 100) priceRanges['$50-$100']++;
      else if (product.price < 500) priceRanges['$100-$500']++;
      else if (product.price < 1000) priceRanges['$500-$1000']++;
      else priceRanges['Over $1000']++;
    });
    
    // Rating distribution
    const ratingRanges = {
      '4.5+': 0,
      '4.0-4.5': 0,
      '3.5-4.0': 0,
      '3.0-3.5': 0,
      'Below 3.0': 0
    };
    
    products.forEach(product => {
      if (product.rating >= 4.5) ratingRanges['4.5+']++;
      else if (product.rating >= 4.0) ratingRanges['4.0-4.5']++;
      else if (product.rating >= 3.5) ratingRanges['3.5-4.0']++;
      else if (product.rating >= 3.0) ratingRanges['3.0-3.5']++;
      else ratingRanges['Below 3.0']++;
    });
    
    // Stock status
    const stockStatus = {
      'In Stock': products.filter(p => p.stock > 10).length,
      'Low Stock': products.filter(p => p.stock <= 10 && p.stock > 0).length,
      'Out of Stock': products.filter(p => p.stock === 0).length
    };
    
    const analytics = {
      totalProducts: products.length,
      categoryDistribution: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
      priceDistribution: Object.entries(priceRanges).map(([name, value]) => ({ name, value })),
      ratingDistribution: Object.entries(ratingRanges).map(([name, value]) => ({ name, value })),
      stockDistribution: Object.entries(stockStatus).map(([name, value]) => ({ name, value })),
      averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
      averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
      topCategories: Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }))
    };
    
    const result = {
      success: true,
      data: analytics
    };
    
    // Cache the result
    cache.set(req.originalUrl, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// GET /api/products/:id
router.get('/:id', cacheMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://dummyjson.com/products/${id}`);
    
    const result = {
      success: true,
      data: response.data
    };
    
    // Cache the result
    cache.set(req.originalUrl, {
      data: result,
      timestamp: Date.now()
    });
    
    res.json(result);
  } catch (error) {
    console.error('Product fetch error:', error);
    if (error.response?.status === 404) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product'
      });
    }
  }
});

module.exports = router;
