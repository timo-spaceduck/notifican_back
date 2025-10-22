import Message from "../models/Message.js"
import User from "../models/User.js"
import { sendFCMPushNotification } from "../services/fcm.service.js"
import Category from "../models/Category.js"

const send = async (req, res) => {
	try {
		const { uuid } = req.params;
		const { message, categoryId, title, data } = req.body || {};

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ error: 'Authorization header with Bearer token required' });
		}

		const token = authHeader.split(' ')[1];

		const user = await User.findOne({
			where: { uuid }
		});

		if(!user) {
			return res.status(404).json({ error: 'Not found' });
		}

		if (user.api_token !== token) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		if(!message) {
			return res.status(404).json({ error: 'No message' });
		}

		await Message.create({
			user_id: user.id,
			category_id: categoryId,
			title: title || '',
			data: data || {},
			text: message,
		});

		if(user.push_token) {

			let tokenTitle = title;

			if(!tokenTitle && categoryId) {
				const category = await Category.findOne(categoryId);
				if(category && category.user_id === user.id) {
					tokenTitle = category.title;
				}
			}

			await sendFCMPushNotification(user.push_token, tokenTitle || '', message);
		}

		return res.status(201).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export default {
	send
};
