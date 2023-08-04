import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import bcrypt from 'bcrypt'
import { ErrorHandler } from '../middlewares/ErrorMiddleware.js'


export const registerUser = async(req,res,next) => {
    const {name,email,picture,password} = req.body
    if(!name || !email || !password){
        next(new ErrorHandler("Please Provide sufficient Information"))
    }
    try{
    const userExists = await User.findOne({email:email})
    if(userExists){
        return res.status(400).json({success:false,message:"user already exist"})
        // next(new ErrorHandler(400,"user already exist"))
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = await User.create({name,email,picture,password:hashedPassword})
    if(user){
        res.status(201).json({
            _id : user._id,
            email : user.email,
            name : user.name,
            picture : user.picture,
            token : generateToken(user._id)
        })
    }
}
catch(e){
    next(new ErrorHandler(403,e.message))
}
}


export const authUser = asyncHandler(async(req,res,next) => {
    const {email,password} = req.body
    const user = await User.findOne({email}).populate({
        path : 'notification',
        model : 'message',
        populate : {
            path : 'chat',
            model : 'chat',
            populate : {
                path : 'users',
                model : 'user'
            }
        }
    })
    const passwordMatched = await bcrypt.compare(password,user.password)
    if(user&&passwordMatched){
        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            picture : user.picture,
            notification:user.notification,
            token : generateToken(user._id)
        })
    }
    else {
        res.status(403)
        throw new Error('please provide valid credentials')
    }
})


export const getAllUser = asyncHandler(async(req,res,next) => {
    const {searchBy} = req.query
    const query  = {$and :[{$or : [
        {name : {$regex:searchBy,$options:'i'}},
        {email : {$regex:searchBy,$options:'i'}},
    ]},
    {_id : {$ne:req.user._id}}
]}
   
    const searchQuery = searchBy ? query : {}
    const users = await User.find(searchQuery).select("-password")
    res.status(200).json({success:true,data:users})
})

export const ManageNotification = asyncHandler(async(req,res,next) => {
    const {message_id,user_id} = req.body
    const included = await User.exists({_id:user_id,notification:message_id})
    try{
    if(included){
        const updatedDoc = await User.findByIdAndUpdate({_id:user_id},{$pull:{notification:message_id}})
        return res.status(200).json({success:true,message:"notification removed"})
    }
    else{
        const updatedDoc = await User.findByIdAndUpdate({_id:user_id},{$push:{notification:message_id}})
        return res.status(200).json({success:true,message:"notification added"})
    }
}
catch(e){
    console.log(e)
    res.status(400).json({success:false,message:"Error Occured in notification manager"})
}
    
})


export const removeAllNotification = asyncHandler(async(req,res) => {
    const updatedDoc = await User.findByIdAndUpdate({_id:req.user._id},{$set:{notification:[]}})
    return res.status(200).json({success:true,message:"all notification removed"})
})