import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRouter from './routes/payment.route.js';
import emailRouter from './routes/email.route.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: '2024-08-01',
//     appInfo: { name: 'GlideX' },
// });


// app.post('/create-payment', async (req, res) => {
//     try {
//         const { name, email, amount } = req.body;

//         const parsedAmount = amount ? Math.abs(parseFloat(amount)) : 40;
//         const amountInCents = Math.round(parsedAmount * 100);

//         if (!name || !email || !amountInCents || amountInCents <= 0) {
//             return res.status(400).json({ error: 'Please enter valid details' });
//         }

//         // Get or create customer
//         const existing = await stripe.customers.list({ email });
//         const customer = existing.data.length > 0
//             ? existing.data[0]
//             : await stripe.customers.create({ email, name });

//         // Create ephemeral key
//         const ephemeralKey = await stripe.ephemeralKeys.create(
//             { customer: customer.id },
//             { apiVersion: '2024-08-01' }
//         );

//         // Create payment intent
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd',
//             customer: customer.id,
//         });

//         return res.status(200).json({
//             paymentIntent: paymentIntent.client_secret,
//             paymentIntentId: paymentIntent.id,
//             customer: customer.id,
//             ephemeralKey: ephemeralKey.secret,
//         });
//     } catch (error) {
//         console.error('Payment Error:', error);
//         return res.status(400).json({
//             error: error?.message || 'Something went wrong',
//         });
//     }
// });


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.GMAIL_USER,
//         pass: process.env.GMAIL_PASS,
//     },
// });


// app.post('/send-email', async (req, res) => {
//     const { to, subject, text, html } = req.body;

//     if (!to || !subject || (!text && !html)) {
//         return res.status(400).json({ success: false, error: 'Missing required fields' });
//     }

//     try {
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
// });

app.use('/api', paymentRouter)
app.use('/api', emailRouter)


app.get('/', (_, res) => {
    res.send('GlideX utils server is running ✅');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
