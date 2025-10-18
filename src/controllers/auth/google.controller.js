import passport from "passport"
import jwt from "jsonwebtoken"

export const auth = passport.authenticate("google", {
	scope: ["profile", "email"]
});

export const authCallback = (req, res) => {
	try {
		const user = req.user;
		const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
		res.cookie("token", token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
		});
		res.redirect(`${process.env.FRONTEND_URL}`);
	} catch (error) {
		console.error("Google callback error:", error);
	}
}

export default { auth, authCallback };
