const nodemailer = require('nodemailer');

// Create transporter based on environment
let transporter;

if (process.env.EMAIL_SERVICE === 'gmail') {
  // Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else if (process.env.EMAIL_HOST) {
  // SMTP (Mailtrap, etc.)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
} else if (process.env.SENDGRID_API_KEY) {
  // SendGrid
  transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
} else {
  console.warn('⚠️  No email service configured');
}

// Send order confirmation to customer
const sendOrderConfirmation = async (order, user) => {
  try {
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.productId?.name || 'Product'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          R ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #C9A96E 0%, #B8935A 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 400; }
            .content { background: #fff; padding: 30px; }
            .order-details { background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A96E; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: 600; }
            .total { font-size: 18px; font-weight: bold; color: #C9A96E; text-align: right; padding-top: 15px; border-top: 2px solid #C9A96E; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Elite Interiors</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Furniture for Discerning Tastes</p>
            </div>
            
            <div class="content">
              <h2 style="color: #1c1a18;">Thank you for your order!</h2>
              <p>Dear ${user.name || 'Valued Customer'},</p>
              <p>We've received your order and will begin processing it right away.</p>
              
              <div class="order-details">
                <strong>Order Number:</strong> #${order._id.toString().slice(-6).toUpperCase()}<br>
                <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-ZA', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}<br>
                <strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'PayPal'}
              </div>
              
              <h3>Order Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              
              <div class="total">
                Total: R ${order.total.toLocaleString()}
              </div>
              
              ${order.total >= 2000 ? `
                <p style="background: #e8f5e9; padding: 15px; border-radius: 4px; margin-top: 20px;">
                  ✓ <strong>Complimentary Delivery</strong> - Your order qualifies for free white glove delivery service.
                </p>
              ` : ''}
              
              <p style="margin-top: 30px;">
                We'll send you another email when your order ships. If you have any questions, please contact us at 
                <a href="mailto:support@eliteinteriors.com" style="color: #C9A96E;">support@eliteinteriors.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p>Elite Interiors | Est. 2026 | Premium Furniture for Modern Living</p>
              <p>This email was sent to ${user.email}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

// Send order notification to admin
const sendAdminOrderNotification = async (order, user) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    
    if (!adminEmail) {
      console.warn('⚠️  No admin email configured');
      return false;
    }

    const itemsList = order.items.map(item => 
      `- ${item.productId?.name || 'Product'} x${item.quantity} = R${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: adminEmail,
      subject: `🛒 New Order #${order._id.toString().slice(-6).toUpperCase()}`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
        <p><strong>Total:</strong> R ${order.total.toLocaleString()}</p>
        <p><strong>Payment:</strong> ${order.paymentMethod}</p>
        <h3>Items:</h3>
        <pre>${itemsList}</pre>
        <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders">View in Admin Panel</a></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent');
    return true;
  } catch (error) {
    console.error('❌ Admin email error:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendAdminOrderNotification
};