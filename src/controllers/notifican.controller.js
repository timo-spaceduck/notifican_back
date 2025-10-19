import Category from "../models/Category.js"
import Message from "../models/Message.js"
import User from "../models/User.js"

export const initial = async (req, res) => {
	const userId = req.user.id;
	return res.json({
		userId: userId,
		url: `https://api-notifican.com/${req.user.uuid}`,
		categories: await Category.findAll({
			where: { user_id: userId }
		}),
		messages: await Message.findAll({
			where: { user_id: userId }
		}),
	});
};

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
		const { title } = req.body;

		const category = await Category.create({
			user_id: req.user.id,
			title
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
		const { title } = req.body;

		const category = await Category.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		await category.update({ title });

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

		return res.status(204).send();
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

const log = async (req, res) => {
	try {
		const { message } = req.body;

		await Message.create({
			user_id: req.user.id,
			text: message,
		});

		return res.status(201).json({ success: true });
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
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	saveToken,
	log
};
