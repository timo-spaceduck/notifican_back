import dotenv from 'dotenv';
import User from "../models/User.js"
dotenv.config();

export default async function (req, res, next) {
	const userId = req.headers['notifican-user-id'];

	const [user, created] = await User.findOrCreate({
		where: {
			uuid: userId
		}
	});

	if (!user?.dataValues?.id) {
		return res.status(401).json({ message: 'Unauthorized user' });
	}

	req.user = user.dataValues;

	next();
}
