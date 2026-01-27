import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { baseUrl } from "../utils/baseUrl";

// Import images for fallback/loading
import jerseyBlack from "../assets/images/jersey_black.png";

// Define the interface for Product
interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    rating: number;
    reviews: number;
    badge: string | null;
}

const categories = ["All", "La Liga", "Premier League", "Ligue 1", "Bundesliga", "Serie A"];

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("featured");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${baseUrl}/products`,);

                console.log(res)

                if (!res.ok) throw new Error("Failed to fetch products");
                const data = await res.json();
                console.log(data);


                // Map backend data to frontend structure
                const mappedProducts = data.map((p: any) => ({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    originalPrice: p.price ? Math.round(p.price * 1.2) : 0,
                    image: p.images?.[0] || jerseyBlack,
                    category: p.category,
                    rating: 4.5, // Default rating
                    reviews: 0, // Default reviews
                    badge: null
                }));

                setProducts(mappedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);

            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products
        .filter(product =>
            (selectedCategory === "All" || product.category === selectedCategory) &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "price-low": return a.price - b.price;
                case "price-high": return b.price - a.price;
                case "rating": return b.rating - a.rating;
                default: return 0;
            }
        });

    return (
        <div className="products-page">
            <Navbar />

            {/* Hero Banner */}
            <section className="products-hero">
                <div className="products-hero-content">
                    <h1>Shop Jerseys</h1>
                    <p>Authentic jerseys from the world's top football clubs</p>
                </div>
            </section>

            <div className="products-container">
                {/* Sidebar Filters */}
                <aside className="products-sidebar">
                    <div className="sidebar-section">
                        <h3>Search</h3>
                        <div className="search-input-wrapper">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                placeholder="Search jerseys..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Categories</h3>
                        <div className="category-list">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                    <span className="category-count">
                                        {category === "All"
                                            ? products.length
                                            : products.filter(p => p.category === category).length
                                        }
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3>Price Range</h3>
                        <div className="price-range">
                            <input type="range" min="0" max="200" defaultValue="100" />
                            <div className="price-labels">
                                <span>$0</span>
                                <span>$200</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <main className="products-main">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <div className="products-header">
                                <p className="results-count">
                                    Showing <strong>{filteredProducts.length}</strong> products
                                </p>
                                <div className="sort-dropdown">
                                    <label>Sort by:</label>
                                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Top Rated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="products-grid">
                                {filteredProducts.map(product => (
                                    <Link to={`/products/${product.id}`} key={product.id} className="product-card-link">
                                        <div className="product-card-shop">
                                            <div className="product-image-wrap">
                                                {product.badge && (
                                                    <span className={`product-badge-shop ${product.badge.toLowerCase().replace(' ', '-')}`}>
                                                        {product.badge}
                                                    </span>
                                                )}
                                                <img src={product.image} alt={product.name} />
                                                <div className="product-actions">
                                                    <button className="action-btn">
                                                        <i className="fa-regular fa-heart"></i>
                                                    </button>
                                                    <button className="action-btn primary">
                                                        <i className="fa-solid fa-cart-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="product-details">
                                                <span className="product-category">{product.category}</span>
                                                <h4 className="product-name">{product.name}</h4>
                                                <div className="product-rating-row">
                                                    <div className="stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={`fa-star ${i < Math.floor(product.rating) ? 'fa-solid' : 'fa-regular'}`}></i>
                                                        ))}
                                                    </div>
                                                    <span className="review-count">({product.reviews})</span>
                                                </div>
                                                <div className="product-price-row">
                                                    <span className="current-price">${product.price}.00</span>
                                                    <span className="original-price">${product.originalPrice}.00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="no-results">
                                    <i className="fa-solid fa-search"></i>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
