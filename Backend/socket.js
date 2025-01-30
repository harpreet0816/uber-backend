const socketIo = require('socket.io');
const userModel = require('./models/user.model.js');
const captainModel = require('./models/captain.model.js');

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
            location.ltd = parseFloat(location.ltd.toFixed(7));
            location.lng = parseFloat(location.lng.toFixed(7));
            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        type: "Point", // GeoJSON type
                        coordinates: [location.lng, location.ltd], // Corrected to "lat" for latitude
                    },
                });
                // console.log("Location updated successfully for captain:", userId);
            } catch (err) {
                console.error("Error updating location:", err.message);
            }
        })

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    })

}

function sendMessageToSocketId (socketId, messageObject){
    if(io){
        io.to(socketId).emit(messageObject.event, messageObject.data);
    }else{
        console.log("socket.io is not initialized");
    }

}

module.exports = { initializeSocket , sendMessageToSocketId , }