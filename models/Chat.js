import mongoose from 'mongoose'

const ChatSchema = new mongoose.Schema({
    chatName : {type:String},
    isGroupChat : Boolean,
    users : [{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    latestMessage : {type:mongoose.Schema.Types.ObjectId,ref:'message'},
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
},{timestamps:true})





const Chat = mongoose.model('chat',ChatSchema)
export default Chat