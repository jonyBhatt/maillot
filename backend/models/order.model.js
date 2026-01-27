const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    },],
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: {
        type: String,
        enum: ['pending', 'tracking', 'delivered'],
        default: 'pending',
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
