import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
	feedback: {
		type: String,
		required: true,
	},
	date: {
		type: mongoose.Schema.Types.Date
	}
})

feedbackSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Feedback = mongoose.model("Feedback", feedbackSchema)

export default Feedback
