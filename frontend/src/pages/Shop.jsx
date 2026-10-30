import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build category list dynamically from products
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Apply search + category filter
  let filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Products...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Shop All Products</h1>

      {/* Filters Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '20px',
        alignItems: 'center',
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
          style={{ marginBottom: 0, flex: '1 1 300px' }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '15px 20px',
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa',
            fontSize: '15px',
            outline: 'none',
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '15px 20px',
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa',
            fontSize: '15px',
            outline: 'none',
          }}
        >
          <option value="default">Sort: Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <p style={{ color: '#71717a', marginBottom: '20px' }}>
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '80px 0', color: '#a1a1aa' }}>
          No products found matching your criteria.
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
