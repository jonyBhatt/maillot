import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router";

interface NavbarProps {
    cartCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount = 0 }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

                    {/* Login */}
                    <Link to="/login" className="nav-cart" aria-label="Login">
                        <i className="fa-solid fa-user"></i>
                    </Link>

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
                <NavLink
                    to="/matches"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-futbol"></i>
                    Matches
                </NavLink>
                <NavLink
                    to="/players"
                    className={({ isActive }: { isActive: boolean }) =>
                        `mobile-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <i className="fa-solid fa-users"></i>
                    Players
                </NavLink>
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
