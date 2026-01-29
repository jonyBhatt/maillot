const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports. Use tls: { rejectUnauthorized: false } if needed for development
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS_CP,
        },

    });

    // Define email options
    const mailOptions = {
        from: `YOURMAILLOT <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
