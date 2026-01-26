import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[MAIL_ERROR]: Email credentials not found in environment variables.');
        return { success: false, error: 'Email configuration missing' };
    }

    try {
        const info = await transporter.sendMail({
            from: `"Thulasi Textiles" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log('[MAIL_SUCCESS]: Email sent to %s', to, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('[MAIL_ERROR]: Failed to send email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}
