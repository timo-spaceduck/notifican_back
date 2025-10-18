import { DataTypes } from "sequelize"
import sequelize from "../services/db.service.js";
import WebUser from "./WebUser.js"

const Todo = sequelize.define('Todo', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	web_user_id: {
		type: DataTypes.BIGINT,
		references: {
			model: WebUser,
			key: "id"
		}
	},
	notes: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	todos: {
		type: DataTypes.JSON,
		allowNull: true,
	},
	todo_groups: {
		type: DataTypes.JSON,
		allowNull: true,
	}
}, {
	tableName: 'todos',
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
});

Todo.belongsTo(WebUser, {
	foreignKey: "web_user_id",
	as: "webUser"
});

export default Todo;
