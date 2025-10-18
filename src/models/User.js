import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";

const User = sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	uuid: {
		type: DataTypes.UUID,
		allowNull: true,
	},
	push_token: {
		type: DataTypes.STRING,
		allowNull: true,
	}
}, {
	tableName: 'users',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
});

export default User;
