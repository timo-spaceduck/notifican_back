import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";

const Feedback = sequelize.define('Feedback', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	project: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	message: {
		type: DataTypes.TEXT,
		allowNull: false,
	}
}, {
	tableName: 'feedbacks',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at'
});

export default Feedback;
