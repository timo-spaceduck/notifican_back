import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
		fs.readFileSync("./keys/notifican-57f1b-firebase-adminsdk-fbsvc-221e8901f8.json", "utf8")
);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export const sendFCMPushNotification = async (token, title, body, data = {}) => {

	const message = {
		notification: {
			title,
			body,
		},
		data,
		token,
	};

	console.log(message);

	try {
		const response = await admin.messaging().send(message);
		console.log("Notification sent successfully:", response);
	} catch (error) {
		console.error("Error sending notification:", error);
	}
}
