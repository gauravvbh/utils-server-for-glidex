import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/create-payment', async (req, res) => {
    try {
        const { name, email, amount } = req.body;
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        const stripeRequest = async (path, params, headers = {}) => {
            const response = await fetch(`https://api.stripe.com/v1/${path}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${stripeSecretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...headers,
                },
                body: new URLSearchParams(params),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || 'Stripe Error');
            return data;
        };

        const customer = await stripeRequest('customers', { email, name });
        const ephemeralKey = await stripeRequest(
            'ephemeral_keys',
            { customer: customer.id },
            { 'Stripe-Version': '2023-10-16' }
        );
        const paymentIntent = await stripeRequest('payment_intents', {
            amount: Math.round(Number(amount) * 100).toString(),
            currency: 'usd',
            customer: customer.id,
        });

        res.json({
            customer: customer.id,
            ephemeralKey: ephemeralKey.secret,
            paymentIntent: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (_, res) => res.send('Stripe backend running ✅'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));