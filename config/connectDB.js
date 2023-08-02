import mongoose from "mongoose"


export const connectDB = async() => {
    const db = await mongoose.connect(process.env.MONGO_URI)
    console.log(`database is connected with ${db.connection.host}`)
}