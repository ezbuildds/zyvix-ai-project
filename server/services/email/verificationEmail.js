import nodemailer from "nodemailer"
import "dotenv/config"
export default async function verificationEmail(otp, email) {
    try {
        const transpoter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.APP_PASSWORD
            }
        })
        const mailConfigration = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Email Verification OTP",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; max-width: 600px; margin: auto;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Hello,</p>
                <p>Your one-time password (OTP) for verification is:</p>
                <div style="background: #f4f4f4; padding: 10px 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #234452; text-align: center; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This code will <strong>expire in 10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</p>
                </div>`

        }
        transpoter.sendMail(mailConfigration, (err, info) => {
            if (err) {
                console.log(err);

            } else {
                console.log("Email sent:", info.response);
            }
        })
    } catch (error) {
        console.log(error.message)
    }


}