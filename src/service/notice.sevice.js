import Notice from "../model/notice.js";

export const createNotice = async (title, description, userId, date) => {
	const notice = new Notice({
		title,
		description,
		userId,
		date
	})

	return notice.save()
}
