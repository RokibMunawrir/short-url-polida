import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const verificationEmailTemplate = (name: string, url: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Anda</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .container { max-width: 600px; margin: 40px auto; padding: 40px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .logo { width: 64px; height: 64px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 20px; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; }
        h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0 0 16px; letter-spacing: -0.025em; }
        p { font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px; }
        .button { display: inline-block; padding: 16px 32px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; transition: all 0.2s; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2); }
        .footer { margin-top: 40px; padding-top: 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5; }
        .footer a { color: #4f46e5; text-decoration: none; font-weight: 600; }
        .highlight { color: #4f46e5; font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">R</div>
        <h1>Verifikasi Alamat Email Anda</h1>
        <p>Halo <span class="highlight">${name}</span>,</p>
        <p>Terima kasih telah bergabung dengan <span class="highlight">Ringkas</span>. Untuk mengaktifkan akun Anda dan mulai menyingkatkan URL, silakan verifikasi alamat email Anda dengan mengeklik tombol di bawah ini:</p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${url}" class="button">Verifikasi Email Sekarang</a>
        </div>

        <p>Tautan ini akan kedaluwarsa dalam 1 jam demi keamanan akun Anda. Jika Anda tidak merasa mendaftar akun di Ringkas, silakan abaikan email ini.</p>
        
        <div class="footer">
            <p><strong>Politeknik Darussalam</strong><br>Unit IT & Inovasi Digital</p>
            <p>Butuh bantuan? <a href="mailto:it@polida.ac.id">Hubungi IT Support</a></p>
        </div>
    </div>
</body>
</html>
`;

export const sendVerificationEmail = async ({ user, url }: { user: any, url: string }) => {
    try {
        console.log(`[EMAIL] Sending verification email to ${user.email}...`);
        console.log(`[EMAIL] Verification URL: ${url}`);
        
        const info = await transporter.sendMail({
            from: `Ringkas Polida <${process.env.MAIL_FROM || 'no-reply@polida.ac.id'}>`,
            to: user.email,
            subject: 'Verifikasi Email Anda - Ringkas Polida',
            html: verificationEmailTemplate(user.name || 'User', url),
        });
        
        console.log(`[EMAIL] Verification email sent successfully to ${user.email}, messageId: ${info.messageId}`);
    } catch (error) {
        // Log the error but do NOT rethrow — rethrowing causes better-auth to return 400
        console.error('[EMAIL] Failed to send verification email:', error);
    }
};

