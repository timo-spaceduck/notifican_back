import sequelize from '../services/db.service.js';

export const initDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('✅ Database connected');
		// Sync models (creates tables if they don’t exist)
		await sequelize.sync();
	} catch (err) {
		console.error('❌ Unable to connect to DB:', err);
	}
}

export default { sequelize, initDB };
