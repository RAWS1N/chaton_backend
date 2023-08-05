import { app } from "./app.js";
import { connectDB } from "./config/connectDB.js";
import {Server} from 'socket.io'

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({success:true,message:"welcome to chaton backend"})
});

const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening on port: ${process.env.PORT}`);
});

const io = new Server(server, {
    pingTimeout:1000*60,
    allowEIO3: true,
  cors: {
    origin: process.env.frontend_url,
    methods: ["get", "put", "post", "delete"],
    credentials: true,
  },
});

io.on('connection',(socket) => {
    socket.on('setup',(userData) => {
        socket.join(userData._id)
        socket.emit('connected')
    })
    socket.on('join room',(room) => {
        console.log('user joined room: '+ room)
    })

    socket.on('typing',(room) => socket.to(room).emit('typing'))
    socket.on('stop typing',(room) => socket.to(room).emit('stop typing'))
    socket.on('new message',(newMessage) => {
        const chat = newMessage.chat
        if(!chat.users) return console.log('chat.users not found')

        chat.users.forEach(user => {
            if(user._id === newMessage.sender._id) return 
            socket.to(user._id).emit('message received',newMessage)
        })

    })

    socket.off('disconnect',() => {
      console.log("user disconnected")
      socket.leave(userData._id)
    })
})
