import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});


export const sendEmail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        const info = await transporter.sendMail({
            from: `"GlideX" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email error:', error.message);
        res.status(500).json({ success: false, error });
    }
}