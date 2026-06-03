import dbConnection from "../../config/database.js";
import jwt from "jsonwebtoken"
import "dotenv/config"
import { ObjectId } from "mongodb";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function chekoutSession(req, res) {
    try {
        const { plan, billing, priceId, credits } = req.body
        const token = req.cookies.token
        console.log(plan, billing, priceId, credits);
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unouthorize"
            })
        }
        if (!plan || !billing || !priceId || !credits) {
            return res.status(400).send({
                success: false,
                message: "invalid plan data"
            })
        }
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        const db = await dbConnection()
        const user = await db.collection("users").findOne({ _id: new ObjectId(decodedUser.userId) })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "user not found"
            })
        }
        // console.log("decoded user :", user)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            customer_email: user.email,
            metadata: {
                userId: user._id.toString(),
                plan,
                credits: credits.toString(),
                billing,
            },
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
        });
        console.log("Stripe session created:", session.id);
        return res.status(200).send({
            success: true,
            sessionUrl: session.url,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }

}