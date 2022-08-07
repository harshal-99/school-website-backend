import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import "express-async-errors"

import {configureDB} from "./utils/config.js";
import {errorHandler, unknownEndpoint} from "./utils/middleware.js";
import userRouter from "./routes/userRouter.js";
import noticeRouter from "./routes/noticeRouter.js";
import photoRouter from "./routes/photoRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";


const app = express()

await configureDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(morgan('dev'))


app.use('/api/auth', userRouter)
app.use('/api/notice', noticeRouter)
app.use('/api/photo', photoRouter)
app.use('/api/feedback', feedbackRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
