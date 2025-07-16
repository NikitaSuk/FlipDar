import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, category } = body;
    if (!name || !email || !subject || !message || !category) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Configure your SMTP transport (use environment variables in production)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'flipdarllc@gmail.com',
        pass: process.env.SMTP_PASS || '', // Set this in your environment
      },
    });

    await transporter.sendMail({
      from: `FlipDar Contact <${process.env.SMTP_USER || 'flipdarllc@gmail.com'}>`,
      to: 'flipdarllc@gmail.com',
      subject: `[FlipDar Contact] ${subject}`,
      text: `Category: ${category}\nFrom: ${name} <${email}>\n\n${message}`,
      html: `<p><b>Category:</b> ${category}</p><p><b>From:</b> ${name} (${email})</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
} 