import Category from "../models/Category.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import {Op} from "sequelize"

export const initial = async (req, res) => {
	const userId = req.user.id;

	return res.json({
		userId: userId,
		url: `https://api.notifican.com/${req.user.uuid}`,
		apiToken: req.user.api_token,
		categories: await Category.findAll({
			where: { user_id: userId }
		}),
		messages: await Message.findAll({
			where: { user_id: userId }
		}),
	});
};

export const getMessages = async (req, res) => {
	try {
		const lastId = parseInt(req.query.lastId) || null;
		let limit = parseInt(req.query.limit) || 20;
		if(limit > 100) limit = 100;
		const categoryId = req.query.categoryId || null;

		const messages = await Message.findAndCountAll({
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'title']
				}
			],
			where: {
				user_id: req.user.id,
				...(lastId && { id: { [Op.lt]: lastId } }),
				...(categoryId && { category_id: categoryId })
			},
			limit,
			order: [['id', 'DESC']]
		});

		return res.json(messages);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

// Get all categories for a user
export const getCategories = async (req, res) => {
	try {
		const categories = await Category.findAll({
			where: {
				user_id: req.user.id
			}
		});
		return res.json(categories);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// Get a single category by ID
export const getCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const category = await Category.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		return res.json(category);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// Create a new category
export const createCategory = async (req, res) => {
	try {
		const { title, notification_enabled } = req.body || {};

		const category = await Category.create({
			user_id: req.user.id,
			title,
			notification_enabled
		});

		return res.status(201).json(category);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// Update a category
export const updateCategory = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, notification_enabled } = req.body || {};

		const category = await Category.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		await category.update({ title, notification_enabled });

		return res.json(category);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

// Delete a category
export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.params;

		const category = await Category.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		await category.destroy();

		console.log('Deleted category with id:', id);

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const deleteMessage = async (req, res) => {
	try {
		const { id } = req.params;

		const message = await Message.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!message) {
			return res.status(404).json({ error: 'Message not found' });
		}

		await message.destroy();

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

const saveToken = async (req, res) => {
	try {
		const { token } = req.body;

		await User.update(
				{ push_token: token },
				{
					where: { id: req.user.id }
				}
		);

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export default {
	initial,
	getMessages,
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	deleteMessage,
	saveToken,
};
