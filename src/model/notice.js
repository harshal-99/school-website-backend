import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 5
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	description: {
		type: String,
		minlength: 5,
	},
	date: {
		type: mongoose.Schema.Types.Date,
		required: true,
	}
})

noticeSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Notice = mongoose.model("Notice", noticeSchema)

export default Notice
