import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 5
	},
	url: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	date: {
		type: mongoose.Schema.Types.Date,
		required: true,
	}
})

photoSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Photo = mongoose.model("Photo", photoSchema)

export default Photo
