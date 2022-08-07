import {Router} from "express";
import Feedback from "../model/feedback.js";
import {body, validationResult} from "express-validator";

const feedbackRouter = Router()

feedbackRouter.get('/', async (request, response) => {
	const feedback = await Feedback
		.find({})
		.sort({date: -1})
		.limit(10)
	response.json(feedback)
})

feedbackRouter.post('/',
	body('feedback').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}

		const {feedback} = request.body

		const savedFeedback = new Feedback({feedback})
		await savedFeedback.save()
		response.json(savedFeedback)
	}
)

export default feedbackRouter
