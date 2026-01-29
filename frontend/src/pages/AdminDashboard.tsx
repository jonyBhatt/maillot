import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { baseUrl } from '../utils/baseUrl';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    countInStock: number;
    createdAt: string;
}

interface OrderItem {
    product: string;
    name: string;
    qty: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    customerDetails: {
        name: string;
        email: string;
        address: string;
        phone: string;
    };
    orderItems: OrderItem[];
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    status: 'pending' | 'tracking' | 'delivered';
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
}

type TabType = 'dashboard' | 'products' | 'orders';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: ''
    });

    // Image upload states
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${baseUrl}/products`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        }
    };

    const varifiedToken = localStorage.getItem('userInfo');


    const fetchOrders = async () => {
        try {
            const response = await fetch(`${baseUrl}/orders`, {
                headers: {
                    Authorization: `Bearer ${varifiedToken}`
                }
            });
            const data = await response.json();


            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    // Image upload handler
    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file);
        });

        setIsUploading(true);
        try {
            const response = await fetch(`${baseUrl}/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedImages(prev => [...prev, ...data.urls]);
                toast.success(`${data.urls.length} image(s) uploaded successfully!`);
            } else {
                throw new Error('Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Failed to upload images');
        } finally {
            setIsUploading(false);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageUpload(e.dataTransfer.files);
    };

    const removeImage = (indexToRemove: number) => {
        setUploadedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadedImages.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        try {
            const productData = {
                name: productForm.name,
                description: productForm.description,
                price: Number(productForm.price),
                images: uploadedImages,
                category: productForm.category,
                countInStock: Number(productForm.countInStock)
            };

            const url = editingProduct
                ? `${baseUrl}/products/${editingProduct._id}`
                : `${baseUrl}/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${varifiedToken}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
                setShowProductModal(false);
                setEditingProduct(null);
                resetProductForm();
                fetchProducts();
            } else {
                throw new Error('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Failed to save product');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            category: product.category,
            countInStock: product.countInStock.toString()
        });
        setUploadedImages(product.images || []);
        setShowProductModal(true);
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${baseUrl}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${varifiedToken}`
                }
            });

            if (response.ok) {
                toast.success('Product deleted successfully!');
                fetchProducts();
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`${baseUrl}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${varifiedToken}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success('Order status updated successfully!');
                fetchOrders();
            } else {
                throw new Error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const resetProductForm = () => {
        setProductForm({
            name: '',
            description: '',
            price: '',
            category: '',
            countInStock: ''
        });
        setUploadedImages([]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FF9500';
            case 'tracking': return '#007AFF';
            case 'delivered': return '#34C759';
            default: return '#8E8E93';
        }
    };

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Link to="/" className="brand-link">
                        <div className="brand-icon">
                            <i className="fas fa-tshirt"></i>
                        </div>
                        <span>Maillot Admin</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <i className="fas fa-chart-line"></i>
                        <span>Dashboard</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <i className="fas fa-box"></i>
                        <span>Products</span>
                        <span className="nav-badge">{products.length}</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <i className="fas fa-shopping-bag"></i>
                        <span>Orders</span>
                        {pendingOrders > 0 && <span className="nav-badge pending">{pendingOrders}</span>}
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="back-to-store">
                        <i className="fas fa-store"></i>
                        <span>Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="dashboard-content">
                        <div className="content-header">
                            <div>
                                <h1>Dashboard Overview</h1>
                                <p>Welcome back! Here's what's happening with your store.</p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card revenue">
                                <div className="stat-icon">
                                    <i className="fas fa-dollar-sign"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Revenue</span>
                                    <span className="stat-value">${totalRevenue.toFixed(2)}</span>
                                </div>
                                <div className="stat-trend up">
                                    <i className="fas fa-arrow-up"></i> 12.5%
                                </div>
                            </div>

                            <div className="stat-card orders">
                                <div className="stat-icon">
                                    <i className="fas fa-shopping-cart"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Orders</span>
                                    <span className="stat-value">{orders.length}</span>
                                </div>
                                <div className="stat-trend up">
                                    <i className="fas fa-arrow-up"></i> 8.2%
                                </div>
                            </div>

                            <div className="stat-card products">
                                <div className="stat-icon">
                                    <i className="fas fa-box"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Products</span>
                                    <span className="stat-value">{products.length}</span>
                                </div>
                            </div>

                            <div className="stat-card pending">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Pending Orders</span>
                                    <span className="stat-value">{pendingOrders}</span>
                                </div>
                                {pendingOrders > 0 && (
                                    <div className="stat-trend warning">
                                        Needs attention
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                <button
                                    className="action-card"
                                    onClick={() => {
                                        setActiveTab('products');
                                        setEditingProduct(null);
                                        resetProductForm();
                                        setShowProductModal(true);
                                    }}
                                >
                                    <div className="action-icon add">
                                        <i className="fas fa-plus"></i>
                                    </div>
                                    <span>Add New Product</span>
                                </button>
                                <button
                                    className="action-card"
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <div className="action-icon view">
                                        <i className="fas fa-eye"></i>
                                    </div>
                                    <span>View All Orders</span>
                                </button>
                                <button
                                    className="action-card"
                                    onClick={() => setActiveTab('products')}
                                >
                                    <div className="action-icon manage">
                                        <i className="fas fa-edit"></i>
                                    </div>
                                    <span>Manage Products</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="recent-section">
                            <div className="section-header">
                                <h2>Recent Orders</h2>
                                <button className="view-all-btn" onClick={() => setActiveTab('orders')}>
                                    View All <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                            <div className="recent-orders-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    <span className="order-id">#{order._id.slice(-8)}</span>
                                                </td>
                                                <td>
                                                    <div className="customer-info">
                                                        <span className="customer-name">{order.customerDetails.name}</span>
                                                        <span className="customer-email">{order.customerDetails.email}</span>
                                                    </div>
                                                </td>
                                                <td>{order.orderItems.length} items</td>
                                                <td className="order-total">${order.totalPrice.toFixed(2)}</td>
                                                <td>
                                                    <span
                                                        className="status-badge"
                                                        style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="products-content">
                        <div className="content-header">
                            <div>
                                <h1>Products Management</h1>
                                <p>Create, edit, and manage your products</p>
                            </div>
                            <button
                                className="add-product-btn"
                                onClick={() => {
                                    setEditingProduct(null);
                                    resetProductForm();
                                    setShowProductModal(true);
                                }}
                            >
                                <i className="fas fa-plus"></i>
                                Add Product
                            </button>
                        </div>

                        <div className="products-table-container">
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id}>
                                            <td>
                                                <div className="product-cell">
                                                    <div className="product-image">
                                                        <img
                                                            src={product.images?.[0] || '/placeholder.jpg'}
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="product-details">
                                                        <span className="product-name">{product.name}</span>
                                                        <span className="product-desc">{product.description.substring(0, 50)}...</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="category-tag">{product.category}</span>
                                            </td>
                                            <td className="price-cell">${product.price.toFixed(2)}</td>
                                            <td>
                                                <span className={`stock-badge ${product.countInStock < 10 ? 'low' : ''}`}>
                                                    {product.countInStock} units
                                                </span>
                                            </td>
                                            <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => handleEditProduct(product)}
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="action-btn delete"
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {products.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-box-open"></i>
                                    <h3>No products yet</h3>
                                    <p>Add your first product to get started</p>
                                    <button
                                        className="add-product-btn"
                                        onClick={() => setShowProductModal(true)}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Add Product
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-content">
                        <div className="content-header">
                            <div>
                                <h1>Orders Management</h1>
                                <p>Track and manage customer orders</p>
                            </div>
                            <div className="order-filters">
                                <span className="filter-label">
                                    <span className="filter-dot pending"></span> {pendingOrders} Pending
                                </span>
                                <span className="filter-label">
                                    <span className="filter-dot delivered"></span> {deliveredOrders} Delivered
                                </span>
                            </div>
                        </div>

                        <div className="orders-list">
                            {orders.map((order) => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-id-section">
                                            <span className="order-label">Order</span>
                                            <span className="order-number">#{order._id.slice(-8)}</span>
                                        </div>
                                        <span
                                            className="status-badge large"
                                            style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                                        >
                                            <i className={`fas fa-${order.status === 'pending' ? 'clock' : order.status === 'tracking' ? 'truck' : 'check-circle'}`}></i>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="order-body">
                                        <div className="order-customer">
                                            <h4><i className="fas fa-user"></i> Customer Details</h4>
                                            <div className="customer-details">
                                                <p><strong>Name:</strong> {order.customerDetails.name}</p>
                                                <p><strong>Email:</strong> {order.customerDetails.email}</p>
                                                <p><strong>Phone:</strong> {order.customerDetails.phone}</p>
                                                <p><strong>Address:</strong> {order.customerDetails.address}</p>
                                            </div>
                                        </div>

                                        <div className="order-items">
                                            <h4><i className="fas fa-box"></i> Order Items ({order.orderItems.length})</h4>
                                            <div className="items-list">
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="order-item">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50';
                                                            }}
                                                        />
                                                        <div className="item-info">
                                                            <span className="item-name">{item.name}</span>
                                                            <span className="item-qty">Qty: {item.qty} × ${item.price.toFixed(2)}</span>
                                                        </div>
                                                        <span className="item-subtotal">${(item.qty * item.price).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="order-summary">
                                            <h4><i className="fas fa-receipt"></i> Order Summary</h4>
                                            <div className="summary-details">
                                                <div className="summary-row">
                                                    <span>Subtotal</span>
                                                    <span>${order.itemsPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span>Tax</span>
                                                    <span>${order.taxPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span>Shipping</span>
                                                    <span>${order.shippingPrice.toFixed(2)}</span>
                                                </div>
                                                <div className="summary-row total">
                                                    <span>Total</span>
                                                    <span>${order.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-date">
                                            <i className="fas fa-calendar"></i>
                                            <span>Ordered on {new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="status-update">
                                            <label>Update Status:</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="tracking">Tracking</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {orders.length === 0 && (
                                <div className="empty-state">
                                    <i className="fas fa-shopping-bag"></i>
                                    <h3>No orders yet</h3>
                                    <p>Orders will appear here once customers make purchases</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Product Modal with Image Upload */}
            {showProductModal && (
                <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
                    <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-modal" onClick={() => setShowProductModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="product-form">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={productForm.name}
                                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    placeholder="Enter product description"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={productForm.countInStock}
                                        onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>League Category</label>
                                <select
                                    value={productForm.category}
                                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    required
                                    className="category-select"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#f8fafc',
                                        fontSize: '0.95rem',
                                        color: '#1e293b'
                                    }}
                                >
                                    <option value="">Select League</option>
                                    <option value="La Liga">La Liga</option>
                                    <option value="Premier League">Premier League</option>
                                    <option value="Ligue 1">Ligue 1</option>
                                    <option value="Bundesliga">Bundesliga</option>
                                    <option value="Serie A">Serie A</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Image Upload Section */}
                            <div className="form-group">
                                <label>Product Images</label>
                                <div
                                    className={`image-upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        style={{ display: 'none' }}
                                    />
                                    {isUploading ? (
                                        <div className="upload-loading">
                                            <div className="loading-spinner small"></div>
                                            <span>Uploading images...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <i className="fas fa-cloud-upload-alt"></i>
                                            <p>Drag & drop images here or click to browse</p>
                                            <span className="upload-hint">Supports: JPG, PNG, WebP, GIF (Max 5MB each)</span>
                                        </>
                                    )}
                                </div>

                                {/* Image Previews */}
                                {uploadedImages.length > 0 && (
                                    <div className="uploaded-images">
                                        {uploadedImages.map((url, index) => (
                                            <div key={index} className="uploaded-image">
                                                <img src={url} alt={`Product ${index + 1}`} />
                                                <button
                                                    type="button"
                                                    className="remove-image"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                                {index === 0 && <span className="primary-badge">Primary</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowProductModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn" disabled={isUploading}>
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
