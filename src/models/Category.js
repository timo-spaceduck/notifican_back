import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";
import User from "./User.js"

const Category = sequelize.define('Category', {
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
	title: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	notification_enabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
	}
}, {
	tableName: 'categories',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
});

export default Category;
