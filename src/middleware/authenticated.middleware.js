import jwt from "jsonwebtoken"

export function isAuthenticated(req, res, next) {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: "Not authenticated" });

	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		return next();
	} catch {
		res.status(401).json({ error: "Unauthorized" });
	}
}
