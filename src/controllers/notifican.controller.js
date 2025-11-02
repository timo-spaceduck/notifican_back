import Category from "../models/Category.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import { Op } from "sequelize"
import sequelize from "../services/db.service.js"

export const initial = async (req, res) => {
	const userId = req.user.id;

	return res.json({
		userId: userId,
		url: `https://api.notifican.com/${req.user.uuid}`,
		apiKey: req.user.api_token,
		categories: await Category.findAll({
			where: { user_id: userId }
		}),
		// messages: await Message.findAll({
		// 	where: { user_id: userId }
		// }),
	});
};

export const getMessages = async (req, res) => {
	try {
		const lastId = parseInt(req.query?.lastId) || null;
		let limit = parseInt(req.query?.limit) || 20;
		if(limit > 100) limit = 100;
		const categoryIds = (req.query?.categoryIds || '').split(',').filter(id => id);
		const newer = req.query?.newer || false;
		const from = req.query?.from || null;
		const to = req.query?.to || null;

		const whereConditions = {
			user_id: req.user.id,
			...(lastId && { id: { [newer ? Op.gt : Op.lt]: lastId } })
		};

		if (categoryIds.length) {
			whereConditions.category_id = { [Op.in]: categoryIds };
		}

		// Handle date range filtering
		if (from || to) {
			const dateFilter = {};
			if (from) {
				dateFilter[Op.gte] = new Date(from);
			}
			if (to) {
				dateFilter[Op.lte] = new Date(to);
			}
			whereConditions.created_at = dateFilter;
		}

		const messages = await Message.findAndCountAll({
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'title', 'color']
				}
			],
			where: whereConditions,
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
		const { title, color, notification_enabled } = req.body || {};

		const category = await Category.create({
			user_id: req.user.id,
			title,
			color,
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
		const { title, color, notification_enabled } = req.body || {};

		const category = await Category.findOne({
			where: {
				id,
				user_id: req.user.id
			}
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found' });
		}

		await category.update({ title, color, notification_enabled });

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

export const readMessages = async (req, res) => {
	try {
		const { ids } = req.body;

		await Message.update(
				{ is_read: true },
				{
					where: {
						id: {
							[Op.in]: ids
						},
						user_id: req.user.id
					}
				}
		);

		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

const saveToken = async (req, res) => {
	try {
		const { token } = req.body;

		console.log(token);

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

const getMessageStatsByPeriod = async (req, res) => {
	try {
		const { period, from, to, categoryIds } = req.query;

		if (!period || !['day', 'hour'].includes(period)) {
			return res.status(400).json({ error: 'Period must be "day" or "hour"' });
		}

		if (!from || !to) {
			return res.status(400).json({ error: 'Both "from" and "to" parameters are required' });
		}

		let fromDate = new Date(from);
		let toDate = new Date(to);

		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			return res.status(400).json({ error: 'Invalid date format' });
		}

		if (fromDate > toDate) {
			return res.status(400).json({ error: 'From date must be before to date' });
		}

		const maxDaysForDay = 60;
		const maxDaysForHour = 2;

		if (period === 'day') {
			const diffTime = Math.abs(toDate - fromDate);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays > maxDaysForDay) {
				fromDate = new Date(toDate);
				fromDate.setDate(fromDate.getDate() - maxDaysForDay);
			}
		} else if (period === 'hour') {
			const diffTime = Math.abs(toDate - fromDate);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

			if (diffDays > maxDaysForHour) {
				fromDate = new Date(toDate);
				fromDate.setDate(fromDate.getDate() - maxDaysForHour);
			}
		}

		const dateFormat = period === 'day' ?
				sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d') :
				sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m-%d %H:00:00');

		const whereCondition = {
			user_id: req.user.id,
			created_at: {
				[Op.between]: [fromDate, toDate]
			}
		};

		if (categoryIds) {
			const categoryIdArray = categoryIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
			if (categoryIdArray.length > 0) {
				whereCondition.category_id = {
					[Op.in]: categoryIdArray
				};
			}
		}

		const messageStats = await Message.findAll({
			attributes: [
				[dateFormat, 'period'],
				[sequelize.fn('COUNT', sequelize.col('id')), 'count']
			],
			where: whereCondition,
			group: [dateFormat],
			order: [[dateFormat, 'ASC']],
			raw: true
		});

		const result = [];
		const current = new Date(fromDate);
		const end = new Date(toDate);

		while (current <= end) {
			let periodKey;
			if (period === 'day') {
				periodKey = current.toISOString().split('T')[0];
				current.setDate(current.getDate() + 1);
			} else {
				periodKey = (current.toISOString().slice(0, 13) + ':00:00').replace('T', ' ');
				current.setHours(current.getHours() + 1);
			}

			const existingStat = messageStats.find(stat => stat.period === periodKey);
			result.push({
				period: periodKey,
				count: existingStat ? parseInt(existingStat.count) : 0
			});
		}

		return res.status(200).json({
			period,
			from: fromDate.toISOString(),
			to: toDate.toISOString(),
			data: result
		});

	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}

export default {
	initial,
	getMessages,
	getMessageStatsByPeriod,
	getCategories,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	deleteMessage,
	readMessages,
	saveToken,
};
