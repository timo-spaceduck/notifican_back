import Category from "../models/Category.js"
import Message from "../models/Message.js"

export const initial = async (req, res) => {
	const userId = req.headers['notifican-user-id'];
	return res.json({
		userId,
		url: `https://api-notifican.com/${userId}`,
		categories: await Category.findAll({ where: { user_id: userId } }),
		messages: await Message.findAll({ where: { user_id: userId } }),
	});
};

export default { initial };
