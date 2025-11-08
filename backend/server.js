require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { nanoid } = require("nanoid");
const path = require("path")


const app = express();
app.use(cors());

const PORT = process.env.PORT

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = {};
let activeIds = new Set();
let friends = {};

function generateUniqueId() {
  let id;
  do id = nanoid(8);
  while (activeIds.has(id));
  activeIds.add(id);
  return id;
}

io.on("connection", (socket) => {
  const userId = generateUniqueId();
  users[socket.id] = userId;
  friends[userId] = [];
  socket.emit("your-id", userId);

  socket.on("send-friend-request", ({ to }) => {
    const from = users[socket.id];
    const recipientSocket = Object.keys(users).find(key => users[key] === to);
    if (recipientSocket && to !== from) {
      io.to(recipientSocket).emit("incoming-request", { from });
    } else {
      socket.emit("error-message", "User not found!");
    }
  });

  socket.on("respond-friend-request", ({ from, accepted }) => {
    const to = users[socket.id];
    const senderSocket = Object.keys(users).find(key => users[key] === from);

    if (accepted) {
      if (!friends[to].includes(from)) friends[to].push(from);
      if (!friends[from]) friends[from] = [];
      if (!friends[from].includes(to)) friends[from].push(to);

      socket.emit("friend-accepted", { from });
      if (senderSocket) io.to(senderSocket).emit("friend-accepted", { from: to });

    } else if (senderSocket) {
      io.to(senderSocket).emit("friend-rejected", { from: to });
    }
  });

  socket.on("send-message", ({ to, message }) => {
    const from = users[socket.id];
    if (friends[from]?.includes(to)) {
      const recipientSocket = Object.keys(users).find(key => users[key] === to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("receive-message", { from, message });
      }
    }
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];

    for (const otherUser in friends) {
      if (friends[otherUser]?.includes(user)) {
        friends[otherUser] = friends[otherUser].filter(f => f !== user);

        const otherSocket = Object.keys(users).find(key => users[key] === otherUser);
        if (otherSocket) io.to(otherSocket).emit("friend-left", { userId: user });
      }
    }

    activeIds.delete(user);
    delete users[socket.id];
    delete friends[user];
  });
});


// ---- Serve Vite Build ---- //
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")))
  app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"))
    
  })
}



server.listen(PORT, () => console.log("🚀 Server running on port 5000"));
