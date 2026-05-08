export default async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        });

        return res.status(200).send({
            success: true,
            message: "Logout success"
        });

    } catch (error) {
         console.error(error);
        return res.status(500).send({
            success: false,
            message: "internal server error"
        });
    }
}