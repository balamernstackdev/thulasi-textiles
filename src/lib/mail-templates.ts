export const getOrderConfirmationTemplate = (order: any) => {
    const itemsHtml = order.items.map((item: any) => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 800; color: #0f172a; text-transform: uppercase; font-size: 14px;">${item.variant.product.name}</div>
                <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">SKU: ${item.variant.sku} | ${item.variant.size || 'Standard'} | ${item.variant.color || 'Default'}</div>
            </td>
            <td style="padding: 12px 0; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 800; color: #0f172a;">
                ${item.quantity} x ₹${parseFloat(item.price).toLocaleString()}
            </td>
        </tr>
    `).join('');

    return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-weight: 900; font-size: 24px; letter-spacing: -0.05em; font-style: italic; text-transform: uppercase;">
                <span style="color: #64748b;">THULASI</span> <span style="color: #ea580c;">TEXTILES</span>
            </div>
            <div style="font-size: 8px; font-weight: 900; color: #ea580c; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 4px;">Women's World</div>
        </div>

        <div style="background: #fff7ed; padding: 24px; border-radius: 20px; border: 1px dashed #fdba74; margin-bottom: 32px;">
            <h1 style="font-weight: 950; color: #9a3412; font-size: 20px; margin: 0 0 8px 0; text-transform: uppercase; font-style: italic;">Order Confirmed!</h1>
            <p style="color: #c2410c; margin: 0; font-size: 14px; font-weight: 600;">Hi ${order.user?.name || 'Customer'}, thank you for shopping with Thulasi Textiles. We've received your order and are preparing it for dispatch.</p>
        </div>

        <div style="margin-bottom: 32px;">
            <div style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 16px;">Order Summary</div>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
                <tr>
                    <td style="padding: 16px 0 8px 0; font-weight: 700; color: #64748b; font-size: 12px; text-transform: uppercase;">Subtotal</td>
                    <td style="padding: 16px 0 8px 0; text-align: right; font-weight: 800; color: #0f172a;">₹${(Number(order.total) + Number(order.discountAmount)).toLocaleString()}</td>
                </tr>
                ${Number(order.discountAmount) > 0 ? `
                <tr>
                    <td style="padding: 4px 0; font-weight: 700; color: #10b981; font-size: 12px; text-transform: uppercase;">Discount Applied</td>
                    <td style="padding: 4px 0; text-align: right; font-weight: 800; color: #10b981;">- ₹${Number(order.discountAmount).toLocaleString()}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; font-weight: 950; color: #0f172a; font-size: 16px; text-transform: uppercase;">Total Paid</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: 950; color: #ea580c; font-size: 20px;">₹${Number(order.total).toLocaleString()}</td>
                </tr>
            </table>
        </div>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <div style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px;">Shipping Address</div>
            <div style="font-size: 14px; color: #334155; line-height: 1.6; font-weight: 600;">
                ${order.address.name}<br/>
                ${order.address.street}<br/>
                ${order.address.city}, ${order.address.state} - ${order.address.zip}
            </div>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <p style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 16px;">Questions about your order? Reply to this email or visit our Help Center.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Track Order Status</a>
        </div>
    </div>
    `;
};

export const getShippingNotificationTemplate = (order: any) => {
    return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-weight: 900; font-size: 24px; letter-spacing: -0.05em; font-style: italic; text-transform: uppercase;">
                <span style="color: #64748b;">THULASI</span> <span style="color: #ea580c;">TEXTILES</span>
            </div>
            <div style="font-size: 8px; font-weight: 900; color: #ea580c; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 4px;">Women's World</div>
        </div>

        <div style="background: #f0fdf4; padding: 24px; border-radius: 20px; border: 1px dashed #86efac; margin-bottom: 32px; text-align: center;">
            <h1 style="font-weight: 950; color: #166534; font-size: 20px; margin: 0 0 8px 0; text-transform: uppercase; font-style: italic;">On Its Way! 🚚</h1>
            <p style="color: #15803d; margin: 0; font-size: 14px; font-weight: 600;">Good news! Your order is shipped and heading your way.</p>
        </div>

        <div style="margin-bottom: 32px;">
            <div style="font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 16px;">Expect Delivery Within</div>
            <div style="font-size: 18px; font-weight: 950; color: #0f172a; text-transform: uppercase; italic;">3-5 Working Days</div>
        </div>

        <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}" style="display: inline-block; background: #ea580c; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 10px 20px -5px rgba(234, 88, 12, 0.3);">Track Shipping</a>
        </div>
    </div>
    `;
};
