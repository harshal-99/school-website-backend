import Notice from "../model/notice.js";
import {Router} from "express";

import {tokenExtractor, tokenValidator} from "../utils/middleware.js";
import {body, param, validationResult} from "express-validator";
import {createNotice} from "../service/notice.sevice.js";
import jwt from "jsonwebtoken";

import {JWT_SECRET} from "../utils/config.js";

const noticeRouter = Router()

noticeRouter.get('/', async (request, response) => {
	const notices = await Notice
		.find({})
		.sort({date: -1})
		.limit(10)
	response.json(notices)
})

noticeRouter.post('/',
	tokenExtractor,
	tokenValidator,
	body('title').escape().isString().trim(),
	body('description').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}
		const decodedToken = jwt.verify(request.token, JWT_SECRET)
		if (!request.token || !decodedToken?.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}

		const {title, description} = request.body

		const savedNotice = await createNotice(title, description, decodedToken.id, new Date())
		response.json(savedNotice)
	})

noticeRouter.delete('/:id',
	tokenExtractor,
	tokenValidator,
	param('id').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)

		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}

		const decodedToken = jwt.verify(request.token, JWT_SECRET)
		if (!request.token || !decodedToken?.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}

		const notice = await Notice.findById(request.params.id)

		if (!notice) {
			return response.status(404).json({error: 'notice not found'})
		}

		if (notice.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'unauthorized access'})
		}

		await Notice.findByIdAndDelete(notice.id)
		response.status(204).end()
	})

noticeRouter.put('/:id',
	tokenExtractor,
	tokenValidator,
	param('id').escape().isString().trim(),
	body('title').escape().isString().trim(),
	body('description').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}

		const decodedToken = jwt.verify(request.token, JWT_SECRET)
		if (!request.token || !decodedToken?.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}

		const notice = await Notice.findById(request.params.id)

		if (!notice) {
			return response.status(404).json({error: 'notice not found'})
		}

		if (notice.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'unauthorized access'})
		}

		const {title, description} = request.body

		const updatedNotice = await Notice.findByIdAndUpdate(notice.id, {title, description, date: new Date()}, {new: true})
		response.json(updatedNotice)
	})

export default noticeRouter
