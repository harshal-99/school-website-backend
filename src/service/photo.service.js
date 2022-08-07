import Photo from "../model/photo.js";

export const createPhoto = async (title, url, userId, date) => {
	const photo = new Photo({
		title, url,
		userId, date
	})

	return photo.save()
}
