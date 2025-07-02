import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-05-28.basil',
    appInfo: { name: 'GlideX' },
});


export const createPayment = async (req, res) => {
    try {
        const { name, email, amount } = req.body;

        const parsedAmount = amount ? Math.abs(parseFloat(amount)) : 40;
        const amountInCents = Math.round(parsedAmount * 100);

        if (!name || !email || !amountInCents || amountInCents <= 0) {
            return res.status(400).json({ error: 'Please enter valid details' });
        }

        // Get or create customer
        const existing = await stripe.customers.list({ email });
        const customer = existing.data.length > 0
            ? existing.data[0]
            : await stripe.customers.create({ email, name });

        // Create ephemeral key
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2025-05-28.basil', }
        );

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            customer: customer.id,
        });

        return res.status(200).json({
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
}