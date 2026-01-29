const generateOrderEmail = (order) => {
    const { _id, customerDetails, orderItems, totalPrice, shippingPrice, taxPrice } = order;

    const itemsHtml = orderItems.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.qty} x $${item.price}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.qty * item.price}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #4CAF50;">Thank you for your order!</h2>
            <p>Hi ${customerDetails.name},</p>
            <p>We have received your order. Here are the details:</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3>Order ID: ${_id}</h3>
                <p><strong>Status:</strong> Pending</p>
                <p><strong>Phone:</strong> ${customerDetails.phone}</p>
                 <p><strong>Address:</strong> ${customerDetails.address}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #f1f1f1;">
                        <th style="padding: 10px; text-align: left;">Image</th>
                        <th style="padding: 10px; text-align: left;">Product</th>
                        <th style="padding: 10px; text-align: left;">Quantity</th>
                        <th style="padding: 10px; text-align: left;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px;">
                <p><strong>Shipping:</strong> $${shippingPrice}</p>
                <p><strong>Tax:</strong> $${taxPrice}</p>
                <h3 style="color: #000;">Total: $${totalPrice}</h3>
            </div>

            <p style="margin-top: 30px; font-size: 12px; color: #777;">If you have any questions, please contact us.</p>
        </div>
    `;
};

const generateAdminOrderEmail = (order) => {
    const { _id, customerDetails, totalPrice } = order;
    return `
        <div style="font-family: Arial, sans-serif;">
            <h2>New Order Placed</h2>
            <p><strong>Order ID:</strong> ${_id}</p>
            <p><strong>Customer:</strong> ${customerDetails.name} (${customerDetails.email})</p>
             <p><strong>Phone:</strong> ${customerDetails.phone}</p>
            <p><strong>Total Amount:</strong> $${totalPrice}</p>
            <p>Please check the admin dashboard for more details.</p>
        </div>
    `;
};

module.exports = { generateOrderEmail, generateAdminOrderEmail };
