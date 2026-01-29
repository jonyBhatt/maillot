import React from 'react';
import { Link } from 'react-router';

const Footer: React.FC = () => {
    return (
        <footer className="footer-modern">
            <div className="container footer-div">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="nav-brand mb-4">
                            <span className="brand-icon">
                                <i className="fa-solid fa-shirt"></i>
                            </span>
                            <h3 className="brand-text" style={{ fontWeight: "bold", fontSize: "24px", color: "#fff" }}>
                                Your <span style={{ color: "var(--primary)" }}>Maillot</span>
                            </h3>
                        </Link>
                        <p className="footer-desc">
                            Premium authentic jerseys from the world's top clubs.
                            Wear your passion with pride.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-twitter"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="social-link"><i className="fa-brands fa-tiktok"></i></a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div className="footer-links">
                        <h4>Shop</h4>
                        <ul>
                            <li><Link to="/products">All Jerseys</Link></li>
                            <li><Link to="/products?category=La Liga">La Liga</Link></li>
                            <li><Link to="/products?category=Premier League">Premier League</Link></li>
                            <li><Link to="/products?category=Serie A">Serie A</Link></li>
                            <li><Link to="/products?category=Bundesliga">Bundesliga</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-links">
                        <h4>Support</h4>
                        <ul>
                            <li><Link to="/track-order">Track Order</Link></li>
                            <li><Link to="/shipping">Shipping Policy</Link></li>
                            <li><Link to="/returns">Returns & Exchange</Link></li>
                            <li><Link to="/faq">FAQs</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="footer-newsletter">
                        <h4>Stay Updated</h4>
                        <p>Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <input type="email" placeholder="Enter your email" required />
                                <button type="submit">
                                    <i className="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                        <div className="payment-methods">
                            <i className="fa-brands fa-cc-visa"></i>
                            <i className="fa-brands fa-cc-mastercard"></i>
                            <i className="fa-brands fa-cc-paypal"></i>
                            <i className="fa-brands fa-cc-apple-pay"></i>
                        </div>
                    </div>
                </div>


            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Your Maillot. All rights reserved.</p>
                <div className="footer-legal">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
