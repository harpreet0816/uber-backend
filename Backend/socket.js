const socketIo = require('socket.io');
const userModel = require('./Models/user.model.js');
const captainModel = require('./Models/captain.model.js');

let io;

function initializeSocket (server){
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("join", async (data) => {
            const { userId, userType } = data;

            if(userType === "user"){
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }else if(userType === "captain"){
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        })

        socket.on("update-location-captain", async (data) => {
            const { userId, location } = data;
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    ltd: location.ltd,
                    lng: location.lng
                }
            }) 
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    })

}

function sendMessageToSocketId (socketId, messageObject){
    console.log(socketId, messageObject);

    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
        console.log("socket.io is not initialized");
    }

}

module.exports = { initializeSocket , sendMessageToSocketId , }