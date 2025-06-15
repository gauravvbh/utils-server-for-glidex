import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-04-30.basil',
    appInfo: { name: 'GlideX' },
});

app.post('/create-payment', async (req, res) => {
    try {
        const { name, email } = req.body;
        let amount = req.body.amount;

        amount = amount ? Math.abs(parseFloat(amount)) : 40;
        const amountInCents = Math.round(amount * 100);

        if (!name || !email || !amountInCents || amountInCents <= 0) {
            return res.status(400).json({ error: 'Please enter valid details' });
        }

        // Check if customer exists
        let customer;
        const existing = await stripe.customers.list({ email });
        if (existing.data.length > 0) {
            customer = existing.data[0];
        } else {
            customer = await stripe.customers.create({ email, name });
        }

        // Create ephemeral key
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2025-03-31.basil' }
        );

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            customer: customer.id,
        });

        return res.json({
            paymentIntent: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            customer: customer.id,
            ephemeralKey: ephemeralKey.secret,
        });
    } catch (error) {
        console.error('Payment Error:', error);
        return res.status(400).json({
            error: error?.message || 'Something went wrong',
        });
    }
});

app.get('/', (_, res) => {
    res.send('GlideX Stripe server is running ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
