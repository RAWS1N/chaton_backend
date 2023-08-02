import express from 'express'
import { accessChat, addInGroup, createGroupChat,  fetchChat,  leaveGroup, removeFromGroup, renameGroup } from '../controllers/chatController.js'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

const router = express.Router()


router.post('/',AuthMiddleware,accessChat)
router.get('/',AuthMiddleware,fetchChat)
router.post('/group',AuthMiddleware,createGroupChat)
router.post('/rename',AuthMiddleware,renameGroup)
router.post('/leave',AuthMiddleware,leaveGroup)
router.post('/add',AuthMiddleware,addInGroup)
router.post('/remove',AuthMiddleware,removeFromGroup)




export default router