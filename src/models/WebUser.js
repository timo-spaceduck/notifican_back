import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";

const WebUser = sequelize.define('WebUser', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	first_name: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	last_name: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: true,
		// set(value) {
		// 	this.setDataValue('password', hash(value));
		// },
	},
	image: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	provider: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	provider_id: {
		type: DataTypes.STRING,
		allowNull: true,
	},
}, {
	tableName: 'web_users',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	defaultScope: {
		attributes: { exclude: ["password"] },
	},
});

export default WebUser;
