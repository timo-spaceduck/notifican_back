import dotenv from 'dotenv';
dotenv.config();

export default function (req, res, next) {
	const authHeader = req.headers['authorization'];

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	const token = authHeader.split(' ')[1];

	if (token !== process.env.STAT_KEY) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	next(); // token is valid, proceed
}
