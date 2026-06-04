import Stripe from "stripe";
import dbConnection from "../../config/database.js";
import { ObjectId } from "mongodb";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function verifyPayment(req, res) {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        return res.status(400).send({ error: "Missing stripe signature" });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log("Webhook signature error:", err.message);
        return res.status(400).send({ error: err.message });
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;
        const credits = parseInt(session.metadata.credits);
        const billing = session.metadata.billing;

        console.log(`Payment success — user: ${userId}, plan: ${plan}, credits: ${credits}`);
        try {
            const db = await dbConnection()
            await db.collection("users").updateOne({ _id: new ObjectId(userId) },
                {
                    $set: {
                        plan: plan,
                        billing: billing,
                        planUpdatedAt: new Date(),
                    }
                })
            await db.collection("payments").insertOne({
                userId: new ObjectId(userId),
                plan,
                credits,
                billing,
                amount: session.amount_total / 100,
                currency: session.currency,
                sessionId: session.id,
                status: "success",
                createdAt: new Date(),
            });
            console.log(`✅ DB updated — user: ${userId}`);
        } catch (err) {
            console.log("DB update error:", err.message);
            return res.status(500).send({
                success: false,
                message: err.message
            })
        }
    }
    if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object;
        console.log("Payment failed:", intent.id);
    }
    return res.status(200).send({
        success: true,
        message: "Payment success"
    })
}