
export const initial = async (req, res) => {
	const userId = req.headers['notifican-user-id'];
	return res.json({
		userId,
		url: '',
		categories: [],
		messages: []
	});
};

export default { initial };
