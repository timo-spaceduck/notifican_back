import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
		process.env.DB_DATABASE,
		process.env.DB_USERNAME,
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			dialect: 'mysql',
			logging: false, // set true to see SQL logs
		});

export default sequelize;
