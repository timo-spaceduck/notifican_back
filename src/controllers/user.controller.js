import jwt from "jsonwebtoken"
import WebUser from "../models/WebUser.js"

const getUser = async (req, res) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ error: "Not authenticated" });

	try {
		const tokenData = jwt.verify(token, process.env.JWT_SECRET);
		const user = await WebUser.findByPk(tokenData.id);
		res.json(user);
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
}

const logout = (req, res) => {
	res.clearCookie("token");
	res.json({ success: true });
}

export default { getUser, logout };
