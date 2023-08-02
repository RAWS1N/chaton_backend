import express from 'express'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import { CreateMessage,FetchMessages } from '../controllers/messageController.js'

const router = express.Router()

router.post('/',AuthMiddleware,CreateMessage)
router.get('/:chatId',AuthMiddleware,FetchMessages)



export default router