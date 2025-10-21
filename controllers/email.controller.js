// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

// dotenv.config();


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//     },
// });


// export const sendEmail = async (req, res) => {
//     const { to, subject, text, html } = req.body;

//     if (!to || !subject || (!text && !html)) {
//         return res.status(400).json({ success: false, error: 'Missing required fields' });
//     }

//     try {
//         console.log(`"GlideX" <${process.env.GMAIL_USER}>`, to, subject, text, html);
//         const info = await transporter.sendMail({
//             from: `"GlideX" <${process.env.GMAIL_USER}>`,
//             to,
//             subject,
//             text,
//             html,
//         });

//         res.status(200).json({ success: true, messageId: info.messageId });
//     } catch (error) {
//         console.error('Email error:', error.message);
//         res.status(500).json({ success: false, error });
//     }
// }


import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (req, res) => {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        const msg = {
            to,
            from: 'gauravtheking884@gmail.com', // Must match your verified sender
            subject,
            text,
            html,
        };

        await sgMail.send(msg);
        console.log(`Email sent to ${to}`);
        res.status(200).json({ success: true, message: `Email sent to ${to}` });
    } catch (error) {
        console.error('SendGrid error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
