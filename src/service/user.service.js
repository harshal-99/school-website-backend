import User from "../model/user.js";
import bcrypt from "bcrypt";

export const createUser = async (username, password) => {
	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		passwordHash,
		isAdmin: true
	})

	return user.save()
}
