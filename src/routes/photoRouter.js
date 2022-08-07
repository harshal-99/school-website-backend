import Photo from "../model/photo.js";
import {Router} from "express";
import {tokenExtractor, tokenValidator} from "../utils/middleware.js";
import {body, param, validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import {createPhoto} from "../service/photo.service.js";
import {JWT_SECRET} from "../utils/config.js";

const photoRouter = Router()

photoRouter.get('/', async (request, response, next) => {
	const photos = await Photo.find({})
		.limit(10)
		.sort({date: -1})
	response.json(photos)
})

photoRouter.post('/',
	tokenExtractor,
	tokenValidator,
	body('title').escape().isString().trim(),
	body('url').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}

		const decodedToken = jwt.verify(request.token, JWT_SECRET)
		if (!request.token || !decodedToken?.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}

		const {title, url} = request.body

		const savedPhoto = await createPhoto(title, url, decodedToken.id, new Date())
		response.json(savedPhoto)
	})

photoRouter.delete('/:id',
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

		const photo = await Photo.findById(request.params.id)

		if (!photo) {
			return response.status(404).json({error: 'photo not found'})
		}

		if (photo.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'unauthorized'})
		}

		await Photo.findByIdAndDelete(photo.id)
		response.status(204).end()
	})


photoRouter.put('/:id',
	tokenExtractor,
	tokenValidator,
	param('id').escape().isString().trim(),
	body('title').escape().isString().trim(),
	body('url').escape().isString().trim(),
	async (request, response, next) => {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json({error: errors.array()})
		}

		const decodedToken = jwt.verify(request.token, JWT_SECRET)
		if (!request.token || !decodedToken?.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}

		const photo = await Photo.findById(request.params.id)

		if (!photo) {
			return response.status(404).json({error: 'photo not found'})
		}

		if (photo.userId.toString() !== decodedToken.id.toString()) {
			return response.status(401).json({error: 'unauthorized'})
		}

		const {title, url} = request.body

		const updatedPhoto = await Photo.findByIdAndUpdate(photo.id, {title, url}, {new: true})
		response.json(updatedPhoto)
	}
)

export default photoRouter
