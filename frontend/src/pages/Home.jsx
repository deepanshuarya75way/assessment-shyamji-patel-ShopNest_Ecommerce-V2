import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 👇 Apni image links yahan add karna
  const heroImages = [
    "https://i.pinimg.com/1200x/a4/e8/7f/a4e87f77a37610077e81af5287f95163.jpg",
    "https://i.pinimg.com/1200x/be/db/84/bedb84a5d76475c5b4e77839d6f210c4.jpg",
    "https://i.pinimg.com/736x/1c/8d/89/1c8d892f1f1baa6f52c1f80dd86e4842.jpg",
    "https://i.pinimg.com/1200x/c3/e8/15/c3e8157d04ba325bcdac813aca9c0597.jpg"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div
        className="hero-banner"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
          url(${heroImages[currentImage]})
          `
        }}
      >
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2>Featured Products</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;