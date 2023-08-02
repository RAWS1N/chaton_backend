import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
    sender : {type:mongoose.Schema.Types.ObjectId,ref:'user'},
    content : {type:String,trim:true},
    chat : {type:mongoose.Schema.Types.ObjectId,ref:'chat'},

},{timestamps:true})



const Message = mongoose.model("message",MessageSchema)
export default Message