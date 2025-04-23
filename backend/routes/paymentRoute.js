import express from 'express'
import Stripe from 'stripe'
import appointmentModel from '../models/appointmentModel.js';
import authUser from '../middlewares/authUser.js'

const paymentRouter = express.Router()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// API to create checkout session
paymentRouter.post('/create-checkout-session', authUser, async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;
        const userId = req.user.id;


        const appointmentData = await appointmentModel.findById(appointmentId);
        console.log('appointmentData', appointmentData)

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(404).json({ success: false, message: "Appointment cancelled or not found" });
        }
        if (appointmentData.userId !== userId) {
            return res.status(403).json({ success: false, message: "You do not have permission to pay for this appointment" });
        }


        // Stripe Checkout 세션 생성
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Appointment Payment',
                            description: 'Payment for your scheduled appointment',
                        },
                        unit_amount: appointmentData.amount * 100, // Stripe는 금액을 센트 단위로 처리
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/my-appointment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: {
                appointmentId: appointmentId,
            },
        });

        res.json({ success: true, sessionId: session.id });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ success: false, message: 'Failed to create checkout session', error: error.message });
    }
});

// ✅ 결제 상태 확인 및 업데이트
paymentRouter.get('/session-status', authUser, async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Missing session_id in query' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || !session.payment_intent) {
            return res.status(400).json({ success: false, message: 'Invalid session or missing payment intent' });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const appointmentId = session.metadata?.appointmentId;
        const userId = req.user.id;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: 'Missing appointment ID' });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.userId !== userId) {
            return res.status(403).json({ success: false, message: 'You do not have permission to check this appointment' });
        }

        if (paymentIntent.status === 'succeeded') {
            if (!appointment.payment) {
                await appointmentModel.findByIdAndUpdate(appointmentId, {
                    payment: true,
                    isCompleted: true,
                });
                console.log('✅ Appointment payment marked as complete');
            }
        }

        res.json({
            success: true,
            paid: paymentIntent.status === 'succeeded',
            status: paymentIntent.status,
            customer_email: session.customer_details?.email,
        });
    } catch (error) {
        console.error('❌ Error retrieving session status:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve session status', error: error.message });
    }
});

//API to verify payment of stripe
const verifyStripe = async(req, res) => {
try {
    
} catch (error) {
    
}
}

export default paymentRouter