import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import asyncHandler from 'express-async-handler'


const AuthMiddleware = asyncHandler(async(req,res,next) => {
    let token = null
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
        ){
            try {
                token = req.headers.authorization.split(" ")[1]
                const decoded_id =  jwt.verify(token,process.env.secret)
                const {id} = decoded_id
                const user = await User.findById({_id:id}).select("-password")
                req.user = user
                next()
            }
            catch(e){
                res.status(403).json({success:false,message:"Invalid Token"})
                throw new Error(e.message)
            }
            if(!token){
                res.status(401).json({success:false,message:"Token not Found"})
                throw new Error('token not found')
            }
        }
})


export default AuthMiddleware