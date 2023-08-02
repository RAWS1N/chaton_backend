import { chats } from "../data.js"
import asyncHandler from 'express-async-handler'
import Chat from '../models/Chat.js'
import User from "../models/User.js"
import Message from "../models/Message.js"

export const accessChat = asyncHandler(async(req,res) => {
    const {userId} = req.body
    console.log('hitted')
    console.log(userId)
    console.log(req.user._id)
    if(!userId){
        console.log('userId not sent via param')
        return res.status(400).json({success:false,message:"userId required"})
    }
    const chatExist = await Chat.find({
        isGroupChat : false,
        $and : [
            {users:{$elemMatch:{$eq : req.user._id}}},
            {users:{$elemMatch:{$eq : userId}}},
        ]
    }).populate('users','-password').populate({path:"latestMessage",model:"message",populate : {
        path : "sender",
        model : "user",
        select : ['picture,name,email']
    }})
    if(chatExist.length > 0){

        res.status(200).json(chatExist[0])
    }else {
        const chatData = {
            chatName : "sender",
            isGroupChat : false,
            users : [req.user._id,userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findById(createdChat._id).populate('users','-password')
            res.status(200).json({success:true,data:fullChat})
        }catch(e){
            throw new Error(e.message)
        }
    }
})

export const fetchChat = asyncHandler(async(req,res) => {
    try{
        const userid = req.user._id
        const chats = await Chat.find({users:{$elemMatch : {$eq:userid}}})
        .populate("users","-password")
        .populate('groupAdmin','-password')
        .populate({
            path:"latestMessage",
            model:'message',
            populate : {
                path : 'sender',
                model : 'user',
                select : ['name',"email",'picture']
        }})
        .sort({updatedAt:-1})
        res.status(200).json({success:true,data:chats})
    }catch(e){
        res.status(400)
        throw new Error('Chat not found')
    }
    
})


export const createGroupChat = asyncHandler(async(req,res,next) => {
    const {name,users} = req.body
    if(!name || !users){
        return res.status(400).json({success:false,message:'Please fill all required fields'})
    }
    const usersArray = JSON.parse(users)
    if(usersArray.length < 2){
        res.status(400).json({success:false,message:'More than 2 users are required to form a group'})
    }
    usersArray.push(req.user._id)
    try {
            const groupChat = await Chat.create({
                chatName : name,
                users : usersArray,
                isGroupChat : true,
                groupAdmin : req.user._id
            })

            const fullGroupData = await Chat.findById(groupChat._id)
            .populate('users','-password')
            .populate('groupAdmin','-password')
            res.status(200).json({success:true,message:'group is created successfuly',data:fullGroupData})
    }
    catch(e){
            res.status(400).json({success:false,message:'error occured while creating group'})
    }
})

export const renameGroup = asyncHandler(async(req,res,next) => {
    const {chatId,chatName} = req.body
    const updated_chat = await Chat.findByIdAndUpdate(chatId,{chatName},{new:true})
    .populate('users','-password')
    .populate('groupAdmin',"-password")

    if(!updated_chat){
        res.status(404).json({success:false,message:"chat not found"})
    }
    else {
        res.status(200).json({success:true,data:updated_chat})
    }
})
export const leaveGroup = async(req,res,next) => {
    res.status(200).json({success:true,data:[]})
}
export const addInGroup = asyncHandler(async(req,res,next) => {
  const {chatId,userId} = req.body  
  const updated_chat = await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true})
  .populate('users','-password')
  .populate('groupAdmin',"-password")

  if(!updated_chat){
    res.status(404).json({success:false,message:"chat not found"})
}
else {
    res.status(200).json({success:true,data:updated_chat})
}
})


export const removeFromGroup = asyncHandler(async(req,res,next) => {
    const {chatId,userId} = req.body
    const user_removed = await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true})
    .populate("users","-password")
    .populate("groupAdmin",'-password')

    if(!user_removed){
        res.status(404).json({success:false,message:"chat not found"})
    }
    else {
        res.status(200).json({success:true,data:user_removed})
    }

})
