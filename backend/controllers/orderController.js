const Order = require('../models/order.model');
const sendEmail = require('../utils/sendEmail');
const { generateOrderEmail, generateAdminOrderEmail } = require('../utils/emailTemplates');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (or Private depending on if guest checkout is allowed)
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            customerDetails,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        } else {
            const order = new Order({
                orderItems,
                customerDetails, // Includes name, email, etc.
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                // user: req.user._id, // Add this if we want to link logged-in data, but schema doesn't strictly enforce it yet
            });
            // If we want to link to a user if logged in, we can add logic here checking req.user

            const createdOrder = await order.save();

            // Send Emails
            try {
                // Email to Customer
                await sendEmail({
                    email: customerDetails.email,
                    subject: 'Order Confirmation - YourMaillot',
                    html: generateOrderEmail(createdOrder)
                });

                // Email to Admin
                await sendEmail({
                    email: process.env.SMTP_USER,
                    subject: 'New Order Received',
                    html: generateAdminOrderEmail(createdOrder)
                });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'orderItems.product',
            'name price images'
        );

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.status = 'delivered';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}) // Populate user if user field exists
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
};
