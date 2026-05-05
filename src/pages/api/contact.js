import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const baseShell = (content) => `
  <div style="margin:0;padding:32px;background:#f4f7f7;font-family:Arial,sans-serif;color:#1f2937;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8e6e5;border-radius:20px;overflow:hidden;">
      <div style="padding:32px 40px;background:linear-gradient(135deg,#173a45 0%,#4B8481 100%);color:#ffffff;">
        <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:.78;">STEAM Workshop</div>
        ${content.header}
      </div>
      <div style="padding:36px 40px;">
        ${content.body}
      </div>
      <div style="padding:20px 40px;border-top:1px solid #e5efee;background:#fbfcfc;color:#6b7280;font-size:13px;line-height:1.7;">
        ${content.footer}
      </div>
    </div>
  </div>
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const emailToOwner = new brevo.SendSmtpEmail();
    emailToOwner.sender = {
      name: process.env.BREVO_FROM_NAME || 'STEAM Workshop',
      email: process.env.BREVO_FROM_EMAIL || 'Steamworkshop.kids@outlook.com'
    };
    emailToOwner.to = [{ email: 'Steamworkshop.kids@outlook.com' }];
    emailToOwner.subject = `New Contact Inquiry: ${subject}`;
    emailToOwner.htmlContent = baseShell({
      header: `
        <h1 style="margin:14px 0 8px;font-size:30px;line-height:1.2;">New contact inquiry</h1>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#d7ecea;">A new message was submitted through the website contact form.</p>
      `,
      body: `
        <div style="display:grid;gap:18px;">
          <div style="padding:18px 20px;border:1px solid #deebea;border-radius:14px;background:#f9fbfb;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:10px;">Sender</div>
            <div style="font-size:18px;font-weight:700;color:#111827;margin-bottom:4px;">${name}</div>
            <div style="font-size:14px;color:#4b5563;">${email}</div>
          </div>
          <div style="padding:18px 20px;border:1px solid #deebea;border-radius:14px;background:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:10px;">Subject</div>
            <div style="font-size:16px;font-weight:600;color:#111827;">${subject}</div>
          </div>
          <div style="padding:20px;border:1px solid #deebea;border-radius:14px;background:#f9fbfb;">
            <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:10px;">Message</div>
            <div style="font-size:15px;line-height:1.8;color:#374151;">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
      `,
      footer: `
        Reply directly to <a href="mailto:${email}" style="color:#4B8481;text-decoration:none;font-weight:700;">${email}</a>.
      `
    });

    await apiInstance.sendTransacEmail(emailToOwner);

    const emailToVisitor = new brevo.SendSmtpEmail();
    emailToVisitor.sender = {
      name: process.env.BREVO_FROM_NAME || 'STEAM Workshop',
      email: process.env.BREVO_FROM_EMAIL || 'Steamworkshop.kids@outlook.com'
    };
    emailToVisitor.to = [{ email }];
    emailToVisitor.subject = 'We received your message';
    emailToVisitor.htmlContent = baseShell({
      header: `
        <h1 style="margin:14px 0 8px;font-size:30px;line-height:1.2;">Thank you for reaching out</h1>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#d7ecea;">Your message has been received and queued for review.</p>
      `,
      body: `
        <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#111827;">Hi <strong>${name}</strong>,</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#4b5563;">Thank you for contacting STEAM Workshop. Our team will review your message and respond within 24 to 48 hours.</p>
        <div style="padding:20px;border:1px solid #deebea;border-radius:14px;background:#f9fbfb;margin-bottom:22px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:10px;">Message summary</div>
          <div style="font-size:16px;font-weight:600;color:#111827;margin-bottom:8px;">${subject}</div>
          <div style="font-size:14px;line-height:1.8;color:#4b5563;">${message.replace(/\n/g, '<br>')}</div>
        </div>
        <div style="padding:18px 20px;border-radius:14px;background:#ffffff;border:1px solid #deebea;">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#4B8481;margin-bottom:10px;">Contact details</div>
          <div style="font-size:14px;line-height:1.9;color:#374151;">
            Phone: <a href="tel:+97699224146" style="color:#4B8481;text-decoration:none;font-weight:700;">+976 99224146</a><br>
            Email: <a href="mailto:Steamworkshop.kids@outlook.com" style="color:#4B8481;text-decoration:none;font-weight:700;">Steamworkshop.kids@outlook.com</a>
          </div>
        </div>
      `,
      footer: `
        STEAM Workshop<br>
        Practical learning for curious builders.
      `
    });

    await apiInstance.sendTransacEmail(emailToVisitor);

    return res.status(200).json({
      message: 'Message sent successfully!',
      data: { name, email, subject }
    });
  } catch (error) {
    console.error('Brevo error:', error);
    return res.status(500).json({
      error: 'Failed to send message. Please try again later.'
    });
  }
}
