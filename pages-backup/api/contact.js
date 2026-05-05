import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Email to you (site owner)
    const msgToOwner = {
      to: 'Steamworkshop.kids@outlook.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@steamworkshop.xyz',
      subject: `New Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #FF9966;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> +976 99224146</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 2px solid #5FCCCA;">
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 2px solid #5FCCCA;">
          <p style="color: #999; font-size: 12px;">
            Reply to: <a href="mailto:${email}">${email}</a>
          </p>
        </div>
      `,
    };

    // Thank you email to visitor
    const msgToVisitor = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@steamworkshop.xyz',
      subject: 'Thank you for contacting STEAM Workshop!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #FF9966;">Thank you, ${name}!</h2>
          <p>We've received your message and will get back to you as soon as possible.</p>
          <p>Our team at STEAM Workshop will review your inquiry and respond within 24-48 hours.</p>
          <hr style="border: none; border-top: 2px solid #5FCCCA;">
          <h3>Your Message:</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 2px solid #5FCCCA;">
          <p style="margin-top: 30px;">
            <strong>Contact Us:</strong><br>
            Phone: <a href="tel:99224146">+976 99224146</a><br>
            Email: <a href="mailto:Steamworkshop.kids@outlook.com">Steamworkshop.kids@outlook.com</a>
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Best regards,<br>
            <strong>STEAM Workshop Team</strong><br>
            Making STEAM awesome for kids everywhere! 🚀
          </p>
        </div>
      `,
    };

    // Send both emails
    await sgMail.send(msgToOwner);
    await sgMail.send(msgToVisitor);

    return res.status(200).json({ 
      message: 'Message sent successfully!',
      data: { name, email, subject }
    });
  } catch (error) {
    console.error('SendGrid error:', error);
    return res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
}