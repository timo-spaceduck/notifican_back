import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";
import User from "./User.js"
import Category from "./Category.js"

const Message = sequelize.define('Message', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.BIGINT,
		references: {
			model: User,
			key: "id"
		}
	},
	category_id: {
		type: DataTypes.BIGINT,
		references: {
			model: User,
			key: "id"
		}
	},
	title: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	text: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	data: {
		type: DataTypes.JSON,
		allowNull: true,
	},
	is_read: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	}
}, {
	tableName: 'messages',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
});

Message.belongsTo(User, {
	foreignKey: "user_id",
	as: "user"
});

Message.belongsTo(Category, {
	foreignKey: "category_id",
	as: "category"
});

export default Message;
