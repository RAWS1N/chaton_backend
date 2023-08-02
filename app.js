import express from 'express'
import ChatRoute from './routes/chatRoutes.js'
import UserRoute from './routes/userRoutes.js'
import MessageRoute from './routes/messageRoutes.js'
import { config } from 'dotenv'
import cors from 'cors'
import {ErrorMiddleware} from './middlewares/ErrorMiddleware.js'
export const app = express()

config({
    path : './config/config.env'
})

app.use(cors({
    origin : process.env.frontend_url,
    methods : ['get','put','post','delete'],
    credentials:true
}))
app.use(ErrorMiddleware)
app.use(express.json())
app.use('/api/v1/chat',ChatRoute)
app.use('/api/v1/user',UserRoute)
app.use('/api/v1/message',MessageRoute)
