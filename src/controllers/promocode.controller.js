import Promocode from "../models/Promocode.js"

export const checkPromocode = async (req, res) => {

	const code = req.body?.code;
	const userId = req.body?.userId;

	if(!code || !userId) {
		return res.status(400)
	}

	const project = 'money-log';

	const promocodeObj = await Promocode.findOne({
		where: { code, project }
	});

	if(!promocodeObj) {
		return res.status(404).json({ valid: false });
	}

	if(promocodeObj.used_at && promocodeObj.user_id !== userId) {
		return res.status(400).json({ valid: false });
	}

	promocodeObj.update({ used_at: new Date(), user_id : userId }).then();

	return res.json({ valid: true });

};

export default { checkPromocode };
