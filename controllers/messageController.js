import asyncHandler from 'express-async-handler'
import Message from '../models/Message.js'
import Chat from '../models/Chat.js'
import User from '../models/User.js'

export const CreateMessage = asyncHandler(async(req,res,next) => {
    const {content,chatId} = req.body
    if(!content || !chatId){
        return res.status(400).json({success:false,message:'invalid data passed'})
    }

    const newMessage = {
        sender:req.user._id,
        content,
        chat : chatId
    }
    try {
            const message = await Message.create(newMessage)
            const messageData = await Message.findById({_id:message._id})
            .populate('sender',['name','picture'])
            .populate({path:'chat',model:'chat',populate:{
                path:'users',
                models : 'user',
                select : ['name','picture','email']
            }})
        

            const updatedChat = await Chat.findByIdAndUpdate({_id:chatId},{
                latestMessage:message._id
            })
            res.status(200).json({success:true,data:messageData})
    }
    catch(e){
        res.status(400).json({success:false,message:"message was not created"})
    }


})
export const FetchMessages = asyncHandler(async(req,res,next) => {
    const chatId = req.params.chatId
    if(!chatId){
        return res.status(400).json({success:false,message:"ChatId required"})
    }
    try {
    const messages = await Message.find({chat:chatId})
        .populate({path:'sender',model:'user',select:['name','email','picture']})
        .populate({path:'chat',model:'chat'})
        res.status(200).json({success:true,data:messages})
    }
    catch(e){
        res.status(400)
        throw new Error(e.message)
    }
})



// export const DeleteMessage = asyncHandler(async(req,res,next) => {})
// export const HideMessage = asyncHandler(async(req,res,next) => {})