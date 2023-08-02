import express from 'express'
import { authUser, getAllUser, registerUser } from '../controllers/userController.js'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'

const router = express.Router()

router.post('/signup',registerUser)
router.post('/signin',authUser)
router.get("/",AuthMiddleware,getAllUser)



export default router