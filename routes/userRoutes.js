import express from 'express'
import { authUser, getAllUser, registerUser,ManageNotification, removeAllNotification } from '../controllers/userController.js'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

const router = express.Router()

router.post('/signup',registerUser)
router.post('/signin',authUser)
router.get("/",AuthMiddleware,getAllUser)
router.post("/notification",AuthMiddleware,ManageNotification)
router.get("/notification/remove",AuthMiddleware,removeAllNotification)



export default router