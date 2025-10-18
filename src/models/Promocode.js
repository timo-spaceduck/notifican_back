import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";

const Promocode = sequelize.define('Promocode', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.UUID,
		allowNull: true,
	},
	project: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	used_at: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	}
}, {
	tableName: 'promocodes',
	timestamps: false,
});

export default Promocode;
