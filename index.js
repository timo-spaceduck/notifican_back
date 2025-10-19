import express from 'express';
import cors from './src/services/cors.service.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import apiRoutes from './src/routes/apiRoutes.js';
import { initDB } from "./src/models/index.js"
import { initPassport } from "./src/services/passport.service.js"

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.use(cors);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // to accept x-www-form-urlencoded

initPassport(app);

app.use('/', apiRoutes);

await initDB()

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
