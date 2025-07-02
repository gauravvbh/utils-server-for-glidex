import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRouter from './routes/payment.route.js';
import emailRouter from './routes/email.route.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api', paymentRouter)
app.use('/api', emailRouter)


app.get('/', (_, res) => {
    res.send('GlideX utils server is running ✅');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
