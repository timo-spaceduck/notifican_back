import Message from "../models/Message.js"
import User from "../models/User.js"
import { sendFCMPushNotification } from "../services/fcm.service.js"

const send = async (req, res) => {
	try {
		const { uuid } = req.params;
		const { message, categoryId } = req.body || {};

		const user = await User.findOne({
			where: { uuid }
		});

		if(!user) {
			return res.status(404).json({ error: 'Not found' });
		}

		if(!message) {
			return res.status(404).json({ error: 'No message' });
		}

		await Message.create({
			user_id: user.id,
			text: message,
		});

		if(user.push_token) {
			await sendFCMPushNotification(user.push_token, message, '');
		}

		return res.status(201).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export default {
	send
};
