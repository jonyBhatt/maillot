import React, { useState } from 'react';
import './CheckoutModal.css';

interface CustomerDetails {
    name: string;
    email: string;
    address: string;
    phone: string;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (details: CustomerDetails) => void;
    totalAmount: number;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSubmit, totalAmount }) => {
    const [details, setDetails] = useState<CustomerDetails>({
        name: '',
        email: '',
        address: '',
        phone: '',
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(details);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Checkout Details</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={details.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={details.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={details.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Shipping Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={details.address}
                                onChange={handleChange}
                                placeholder="Enter your full address"
                                rows={3}
                                required
                            ></textarea>
                        </div>

                        <div className="order-total-preview">
                            <span>Total to Pay:</span>
                            <strong>${totalAmount.toFixed(2)}</strong>
                        </div>

                        <div className="form-footer">
                            <button type="button" className="btn-cancel" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit">
                                Place Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
