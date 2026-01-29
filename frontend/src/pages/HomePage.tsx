import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import heroPlayer from "../assets/images/hero_player.png";
import jerseyBlack from "../assets/images/jersey_black.png";
import jerseyOrange from "../assets/images/jersey_orange.png";
import madrid from "../assets/images/madrid.jpg";

// Slider images
import slider1 from "../assets/images/slider/IMG_5367.png";
import slider2 from "../assets/images/slider/IMG_5368.png";
import slider3 from "../assets/images/slider/IMG_5369.png";
import slider4 from "../assets/images/slider/barca.png";
import slider5 from "../assets/images/slider/IMG_5370.png";
import slider6 from "../assets/images/slider/IMG_5373.png";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

const Home: React.FC = () => {
    const { addToCart } = useCart();
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [slider1, slider2, slider3, slider4, slider5, slider6];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "100+", label: "Jersey Designs" },
        { number: "15+", label: "Global Brands" },
    ];

    const featuredProducts = [
        { id: "1", name: "Real Madrid Home Kit", price: 89, image: jerseyBlack, badge: "New Season" },
        { id: "2", name: "Barcelona Away Kit", price: 85, image: jerseyOrange, badge: "Best Seller" },
        { id: "3", name: "Premium Training Kit", price: 65, image: madrid, badge: "Sale" },
    ];

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: "M", // Default for quick add
            color: "Standard",
            quantity: 1
        });
    };

    return (
        <div className="homepage" >
            <Navbar />
            <div style={{
                zIndex: 899
            }}>
                {/* HERO SECTION - Content Left, Image Right */}
                <section className="hero-section-new" style={{
                    zIndex: 8
                }}>
                    <div className="hero-bg-gradient"></div>
                    <div className="hero-orb hero-orb-1"></div>
                    <div className="hero-orb hero-orb-2"></div>

                    <div className="container mx-auto">
                        <div className="hero-grid">
                            {/* LEFT - Content */}
                            <div className="hero-content">
                                <div className="hero-badge">
                                    <span className="badge-dot"></span>
                                    New Collection 2026
                                </div>

                                <h1 className="hero-title">
                                    Wear Your
                                    <span className="text-gradient"> Passion</span>
                                </h1>

                                <p className="hero-description">
                                    Premium authentic jerseys from the world's top clubs.
                                    Crafted for champions, designed for you.
                                </p>

                                <div className="hero-buttons">
                                    <Link to="/products" className="btn-primary-glow">
                                        <span>Explore Collection</span>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </Link>
                                    <button className="btn-secondary-outline">
                                        <i className="fa-solid fa-play"></i>
                                        Watch Story
                                    </button>
                                </div>

                                <div className="hero-stats">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="stat-box">
                                            <span className="stat-num">{stat.number}</span>
                                            <span className="stat-text">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT - Hero Player Image */}
                            <div className="hero-image-wrapper">
                                <div className="hero-image-glow"></div>
                                <img
                                    src={heroPlayer}
                                    alt="Football Player"
                                    className="hero-player-img"
                                    loading="lazy"
                                />

                                {/* Floating Card */}
                                <div className="hero-floating-card">
                                    <div className="floating-icon">🔥</div>
                                    <div className="floating-info">
                                        <strong>Trending Now</strong>
                                        <span>Champions League Kits</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SLIDER SECTION - Centered */}
                <section className="slider-section">
                    <div className="container">
                        <div className="slider-header">
                            <span className="section-label">Featured Jerseys</span>
                            <h2 className="section-title">Our Collection</h2>
                        </div>

                        <div className="centered-slider">
                            <div className="slider-track">
                                {slides.map((slide, index) => {
                                    let position = index - currentSlide;
                                    if (position < -2) position += slides.length;
                                    if (position > 3) position -= slides.length;

                                    return (
                                        <div
                                            key={index}
                                            className={`slide-item ${position === 0 ? 'active' : ''}`}
                                            style={{
                                                '--position': position
                                            } as React.CSSProperties}
                                        >
                                            <img src={slide} alt={`Jersey ${index + 1}`} loading="lazy" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="slider-controls">
                                <button
                                    className="slider-btn prev"
                                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <div className="slider-dots">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                                            onClick={() => setCurrentSlide(index)}
                                        />
                                    ))}
                                </div>
                                <button
                                    className="slider-btn next"
                                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BRANDS MARQUEE */}
                <section className="brands-marquee">
                    <div className="marquee-track">
                        {['NIKE', 'ADIDAS', 'PUMA', 'UNDER ARMOUR', 'NEW BALANCE', 'NIKE', 'ADIDAS', 'PUMA', 'UNDER ARMOUR', 'NEW BALANCE'].map((brand, i) => (
                            <span key={i} className="brand-item">{brand}</span>
                        ))}
                    </div>
                </section>

                {/* FEATURED PRODUCTS */}
                <section className="featured-section" style={{ padding: '40px 50px' }}>
                    <div className="container">
                        <div className="section-header-modern">
                            <div className="header-left">
                                <span className="section-tag">Featured</span>
                                <h2 className="section-title-modern">Top Picks For You</h2>
                            </div>
                            <Link to="/products" className="view-all-link">
                                View All <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </div>

                        <div className="products-grid-modern">
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="product-card-modern">
                                    <div className="product-image-container">
                                        <span className="product-badge">{product.badge}</span>
                                        <img src={product.image} alt={product.name} loading="lazy" />
                                        <div className="product-overlay">
                                            <button className="quick-view-btn">
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                            <button
                                                className="add-cart-btn"
                                                onClick={(e) => handleAddToCart(e, product)}
                                            >
                                                <i className="fa-solid fa-cart-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="product-info-modern">
                                        <h4>{product.name}</h4>
                                        <div className="product-meta">
                                            <span className="product-price">${product.price}.00</span>
                                            <div className="product-rating">
                                                <i className="fa-solid fa-star"></i>
                                                <span>4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES STRIP */}
                <section className="features-strip">
                    <div className="container">
                        <div className="features-grid-modern">
                            <div className="feature-item-modern">
                                <div className="feature-icon-modern">
                                    <i className="fa-solid fa-truck-fast"></i>
                                </div>
                                <div className="feature-content">
                                    <h4>Free Shipping</h4>
                                    <p>On orders above $50</p>
                                </div>
                            </div>
                            <div className="feature-item-modern">
                                <div className="feature-icon-modern">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </div>
                                <div className="feature-content">
                                    <h4>100% Authentic</h4>
                                    <p>Verified products only</p>
                                </div>
                            </div>
                            <div className="feature-item-modern">
                                <div className="feature-icon-modern">
                                    <i className="fa-solid fa-rotate-left"></i>
                                </div>
                                <div className="feature-content">
                                    <h4>Easy Returns</h4>
                                    <p>30-day return policy</p>
                                </div>
                            </div>
                            <div className="feature-item-modern">
                                <div className="feature-icon-modern">
                                    <i className="fa-solid fa-headset"></i>
                                </div>
                                <div className="feature-content">
                                    <h4>24/7 Support</h4>
                                    <p>We're here to help</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="cta-section-modern">
                    <div className="cta-bg-image" style={{ backgroundImage: `url(${heroPlayer})` }}></div>
                    <div className="cta-overlay"></div>
                    <div className="container position-relative">
                        <div className="cta-content-modern">
                            <span className="cta-tag">Limited Time Offer</span>
                            <h2>Get 20% Off Your First Order</h2>
                            <p>Join our newsletter and unlock exclusive deals, new arrivals, and member-only discounts.</p>
                            <div className="cta-form">
                                <input type="email" placeholder="Enter your email" />
                                <button type="submit">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />

        </div>
    );
};

export default Home;
