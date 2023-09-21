// importing express
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

dotenv.config();
connectDB();
const app = express();

//to accept json data
app.use(express.json());
// Very First Expressjs Api Is Here

app.get("/",(req,res)=>{
res.send("API Is Running");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
//A Little More Complex API

app.use(notFound);
app.use(errorHandler);

/*app.get("/api/chat",(req,res) =>{
    res.send(chats);
});*/

//Another endpoint for particular id data

/*app.get('/api/chat/:id',(req,res) => {
  //console.log(req.params.id);
  const singleChat = chats.find(c=>c._id===req.params.id);
  res.send(singleChat);
});*/

const PORT =process.env.PORT || 5000;

const server = app.listen(`${PORT}`,console.log(`Server Started on PORT ${PORT}`));

const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin: "http://localhost:3000",
  },
});

io.on("connection",(socket) => {
  console.log("connected to the socket.io");

  socket.on('setup',(userData) => {
    socket.join(userData._id);
    //console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat",(room) => {
    socket.join(room);
    console.log("user Joined room" + room);
  });
  
  socket.on("typing",(room) => socket.in(room).emit("typing"));
  socket.on("stop typing",(room) => socket.in(room).emit("stop typing"));
  
 socket.on("new message",(newMessageRecieved) => {
  
   var chat = newMessageRecieved.chat;

   if(!chat.users) return console.log("chat.users not defined");

   chat.users.forEach((user) => {
   if(user._id == newMessageRecieved.sender._id) return;

   socket.in(user._id).emit("message recieved",newMessageRecieved);
   });

  });

   socket.off("setup",() => {
   console.log("USER DISCONNECTED");
   socket.leave(userData._id);
  });
});