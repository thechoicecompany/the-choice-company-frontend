interface OrderEmailData {
  orderId: string;
  paymentId: string;
  customer: { name: string; email: string; phone: string; address: { line1: string; city: string; state: string; pincode: string } };
  items: { name: string; quantity: number; samplePrice: number; subtotal: number }[];
  total: number;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587,
    secure: false, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const itemsHtml = data.items.map(i =>
    `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
     <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
     <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${i.subtotal.toLocaleString("en-IN")}</td></tr>`
  ).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
      <div style="background:#0D1B2A;padding:20px;text-align:center">
        <h1 style="color:#C89B3C;margin:0;font-size:22px">The Choice Company</h1>
        <p style="color:#fff;opacity:0.7;margin:4px 0 0;font-size:12px">Order Confirmed ✓</p>
      </div>
      <div style="padding:28px 24px;background:#fff">
        <h2 style="color:#0D1B2A;margin-top:0">Your sample is on its way! 🎉</h2>
        <p style="color:#555">Dear <strong>${data.customer.name}</strong>,</p>
        <p style="color:#555">Your sample purchase has been confirmed and payment received. We'll deliver within 7–10 working days.</p>
        <div style="background:#F9F7F3;border-radius:8px;padding:16px;margin:20px 0;border-left:4px solid #C89B3C">
          <p style="margin:0;font-size:13px;color:#555">Order ID</p>
          <h3 style="margin:4px 0 0;color:#0D1B2A;font-size:20px">${data.orderId}</h3>
          <p style="margin:4px 0 0;font-size:11px;color:#888">Payment ID: ${data.paymentId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px">
          <thead><tr style="background:#0D1B2A">
            <th style="padding:8px 12px;color:#C89B3C;text-align:left">Product</th>
            <th style="padding:8px 12px;color:#C89B3C;text-align:center">Qty</th>
            <th style="padding:8px 12px;color:#C89B3C;text-align:right">Amount</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr>
            <td colspan="2" style="padding:10px 8px;font-weight:bold;color:#0D1B2A">Total (incl. GST)</td>
            <td style="padding:10px 8px;font-weight:bold;text-align:right;color:#C89B3C">₹${data.total.toLocaleString("en-IN")}</td>
          </tr></tfoot>
        </table>
        <p style="color:#555;font-size:13px"><strong>Delivery Address:</strong><br>
          ${data.customer.address.line1}, ${data.customer.address.city}, ${data.customer.address.state} - ${data.customer.address.pincode}
        </p>
        <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:8px;padding:16px;margin-top:20px">
          <h4 style="color:#166534;margin:0 0 8px">👍 Happy with the sample quality?</h4>
          <p style="color:#166534;font-size:13px;margin:0">Place a bulk order (MOQ 50 units) with your logo branded at wholesale rates.</p>
          <a href="https://thechoicecompany.in/bulk-orders" style="display:inline-block;margin-top:12px;background:#1A5C4A;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px">Get Bulk Quote →</a>
        </div>
      </div>
      <div style="background:#0D1B2A;padding:12px;text-align:center">
        <p style="color:#fff;opacity:0.4;margin:0;font-size:11px">© ${new Date().getFullYear()} The Choice Company · +91 62688 9194</p>
      </div>
    </div>`;

  await transporter.sendMail({
    from: `"The Choice Company" <${process.env.EMAIL_FROM}>`,
    to: data.customer.email,
    cc: process.env.EMAIL_SALES,
    subject: `Order Confirmed — ${data.orderId} | The Choice Company`,
    html,
  });
}
