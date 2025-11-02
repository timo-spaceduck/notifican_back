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

		let category;

		if(categoryId) {
			category = await Category.findByPk(categoryId);
			if(!category || category.user_id !== user.id) {
				return res.status(404).json({ error: 'Category not found' });
			}
		}

		const messageCreated = await Message.create({
			user_id: user.id,
			category_id: categoryId,
			title: title || '',
			data: data || {},
			text: message,
		});

		if(user.push_token) {

			let tokenTitle = title;

			if(!tokenTitle && category) {
				tokenTitle = category.title;
			}

			await sendFCMPushNotification(user.push_token, tokenTitle || '', message);
		}

		return res.status(201).json({ messageId: messageCreated.id });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

const stats = async (req, res) => {
	// const messages = await Message.findAll();
	// for(let i = 0; i < messages.length; i++) {
	// 	const message = messages[i];
	// 	const text = (message.text || '').split('\n');
	// if(text.length === 4) {
	// 	const data = {
	// 		'platform': text[0],
	// 		'userId': text[1],
	// 		'message': text[2],
	// 		'userIdDb': text[3] === 'New user' ? null : text[3].replace('Existing user: ', ''),
	// 	}
	// 	await message.update({ data });
	// }
	// }
	return res.status(200).json({ success: true });
}

export default {
	send,
	stats
};
