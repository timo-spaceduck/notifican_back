import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class TelegramService {
	constructor() {
		this.token = process.env.TELEGRAM_BOT_TOKEN;
		this.chatId = process.env.TELEGRAM_CHAT_ID;
		this.apiUrl = `https://api.telegram.org/bot${this.token}/sendMessage`;
	}

	async sendMessage(text) {
		try {
			// const response = await axios.post(this.apiUrl, {
			// 	chat_id: this.chatId,
			// 	text,
			// 	parse_mode: 'HTML' // or 'Markdown'
			// });

			const response = await axios.get(this.apiUrl, {
				data: {
					chat_id: this.chatId,
					text,
					parse_mode: 'HTML' // or 'Markdown'
				}
			});

			return response.data;
		} catch (error) {
			console.error('Failed to send message:', error.response?.data || error.message || error);
			console.log(error.data);
		}
	}
}

export default new TelegramService();
