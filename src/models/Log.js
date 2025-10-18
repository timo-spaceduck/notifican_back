import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";

const Log = sequelize.define('Log', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.UUID,
		allowNull: true,
	},
	platform: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	message: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	created_at: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	}
}, {
	tableName: 'logs', // match existing table
	timestamps: false,  // disable createdAt/updatedAt if not needed
});

export default Log;
