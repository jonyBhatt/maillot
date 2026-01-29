import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

const Navbar: React.FC = () => {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const token = localStorage.getItem("userInfo");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                {/* Brand/Logo */}
                <Link to="/" className="nav-brand">
                    <span className="brand-icon">
                        <i className="fa-solid fa-shirt"></i>
                    </span>
                    <h3 className="brand-text" style={{ fontWeight: "bold", fontSize: "24px" }}>
                        Your {" "}
                        <span className="brand-text" style={{ color: "var(--primary)" }}>Maillot</span>
                    </h3>

                </Link>

                {/* Desktop Navigation */}
                <div className="nav-menu">
                    <NavLink
                        to="/"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-menu-link ${isActive ? "active" : ""}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/products"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-menu-link ${isActive ? "active" : ""}`
                        }
                    >
                        Products
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }: { isActive: boolean }) =>
                            `nav-menu-link ${isActive ? "active" : ""}`
                        }
                    >
                        About
                    </NavLink>
                    {
                        token && (
                            <NavLink
                                to="/admin"
                                className={({ isActive }: { isActive: boolean }) =>
                                    `nav-menu-link ${isActive ? "active" : ""}`
                                }
                            >
                                Admin
                            </NavLink>
                        )
                    }
                </div>

                {/* Right Section - Search & Cart */}
                <div className="nav-actions">
                    {/* Search */}
                    <div className="nav-search">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search jerseys..." />
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="nav-cart">
                        <i className="fa-solid fa-bag-shopping"></i>
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {/* Login/Logout */}
                    {
                        !token ? (
                            <Link to="/login" className="nav-cart" aria-label="Login">
                                <i className="fa-solid fa-user"></i>
                            </Link>
                        ) : (
                            <button onClick={handleLogout} className="nav-cart" aria-label="Logout" style={{ background: "none", border: "none", cursor: "pointer" }}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                        )
                    }

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} >
                <NavLink
                    to="/"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-home"></i>
                    Home
                </NavLink>
                <NavLink
                    to="/products"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-shirt"></i>
                    Products
                </NavLink>
                {
                    token && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }: { isActive: boolean }) =>
                                `mobile-link ${isActive ? "active" : ""}`
                            }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <i className="fa-solid fa-user"></i>
                            Admin
                        </NavLink>
                    )
                }
                <NavLink
                    to="/about"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-info-circle"></i>
                    About
                </NavLink>
                <NavLink
                    to="/cart"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-bag-shopping"></i>
                    Cart
                    {cartCount > 0 && (
                        <span className="mobile-cart-badge">{cartCount}</span>
                    )}
                </NavLink>

                {
                    !token ? (
                        <NavLink
                            to="/login"
                            className={({ isActive }: { isActive: boolean }) =>
                                `mobile-link ${isActive ? "active" : ""}`
                            }
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <i className="fa-solid fa-user"></i>
                            Login
                        </NavLink>
                    ) : (
                        <button
                            className="mobile-link"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    )
                }

                {/* Mobile Search */}
                <div className="mobile-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search jerseys..." />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
