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

	if(!user.dataValues?.api_token) {
		await user.update({ api_token: crypto.randomUUID().toString() });
		// user.dataValues.api_token = crypto.randomUUID().toString();
	}

	req.user = user.dataValues;

	next();
}
