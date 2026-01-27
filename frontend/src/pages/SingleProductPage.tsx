import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { baseUrl } from "../utils/baseUrl";

// Import images
import jerseyBlack from "../assets/images/jersey_black.png";

const SingleProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState("description");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${baseUrl}/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();

                const mappedProduct = {
                    id: data._id,
                    name: data.name,
                    price: data.price,
                    originalPrice: data.price ? Math.round(data.price * 1.2) : 0,
                    images: data.images && data.images.length > 0 ? data.images : [jerseyBlack],
                    category: data.category,
                    rating: 4.8, // Default rating as backend doesn't have it
                    reviews: 0, // Default reviews
                    description: data.description,
                    sizes: ["S", "M", "L", "XL", "XXL"], // Default sizes
                    colors: ["Standard"], // Default colors if none
                    inStock: data.countInStock > 0,
                    features: [
                        "Official Merchandise",
                        "High Quality Material",
                        "Comfortable Fit",
                        "Durable Stitching"
                    ]
                };

                setProduct(mappedProduct);
                if (mappedProduct.colors.length > 0) setSelectedColor(mappedProduct.colors[0]);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        // Add to cart logic here
        toast.success(`Added ${quantity} x ${product.name} to cart!`, {
            icon: '🛒',
        });
    };

    if (loading) {
        return (
            <div className="single-product-page">
                <Navbar />
                <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
                    <h2>Loading product...</h2>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="single-product-page">
                <Navbar />
                <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
                    <h2>Product not found</h2>
                    <Link to="/products" className="btn-primary">Back to Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="single-product-page">
            <Navbar />

            {/* Breadcrumb */}
            <div className="breadcrumb-section">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/products">Products</Link>
                        <span>/</span>
                        <span className="current">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <section className="product-detail-section">
                <div className="container">
                    <div className="product-detail-grid">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image">
                                <img src={product.images[activeImage]} alt={product.name} />
                                <button className="wishlist-btn">
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                            </div>
                            <div className="thumbnail-list">
                                {product.images.map((img: string, index: number) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="product-info">
                            <span className="product-category-tag">{product.category}</span>
                            <h1 className="product-title">{product.name}</h1>

                            <div className="product-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-star ${i < Math.floor(product.rating) ? 'fa-solid' : 'fa-regular'}`}></i>
                                    ))}
                                </div>
                                <span>{product.rating}</span>
                                <span className="reviews">({product.reviews} reviews)</span>
                            </div>

                            <div className="product-price">
                                <span className="current">${product.price}.00</span>
                                <span className="original">${product.originalPrice}.00</span>
                                <span className="discount">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                </span>
                            </div>

                            <p className="product-description">{product.description}</p>

                            {/* Color Selection */}
                            <div className="option-section">
                                <h4>Color: <span>{selectedColor}</span></h4>
                                <div className="color-options">
                                    {product.colors.map((color: string) => (
                                        <button
                                            key={color}
                                            className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                            // Handling simple color display since backend doesn't forbid it. 
                                            // If color is not a valid css color name, this might be invisible. 
                                            // But for 'Standard' it won't show color.
                                            // Adding a key to make it visible anyway if it's text.
                                            style={{ backgroundColor: color.toLowerCase() === 'standard' ? '#333' : color.toLowerCase() }}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="option-section">
                                <h4>Size: <span>{selectedSize || 'Select size'}</span></h4>
                                <div className="size-options">
                                    {product.sizes.map((size: string) => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <Link to="#" className="size-guide">Size Guide</Link>
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="purchase-section">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    <i className="fa-solid fa-cart-plus"></i>
                                    Add to Cart
                                </button>
                                <button className="buy-now-btn">
                                    Buy Now
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="badge">
                                    <i className="fa-solid fa-truck"></i>
                                    <span>Free Shipping</span>
                                </div>
                                <div className="badge">
                                    <i className="fa-solid fa-shield-check"></i>
                                    <span>Authentic</span>
                                </div>
                                <div className="badge">
                                    <i className="fa-solid fa-rotate-left"></i>
                                    <span>30-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Tabs */}
                    <div className="product-tabs">
                        <div className="tab-buttons">
                            <button
                                className={activeTab === 'description' ? 'active' : ''}
                                onClick={() => setActiveTab('description')}
                            >
                                Description
                            </button>
                            <button
                                className={activeTab === 'features' ? 'active' : ''}
                                onClick={() => setActiveTab('features')}
                            >
                                Features
                            </button>
                            <button
                                className={activeTab === 'reviews' ? 'active' : ''}
                                onClick={() => setActiveTab('reviews')}
                            >
                                Reviews ({product.reviews})
                            </button>
                        </div>
                        <div className="tab-content">
                            {activeTab === 'description' && (
                                <div className="tab-pane">
                                    <p>{product.description}</p>
                                </div>
                            )}
                            {activeTab === 'features' && (
                                <div className="tab-pane">
                                    <ul className="features-list">
                                        {product.features.map((feature: string, index: number) => (
                                            <li key={index}>
                                                <i className="fa-solid fa-check"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'reviews' && (
                                <div className="tab-pane">
                                    <p>Customer reviews coming soon...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SingleProductPage;
