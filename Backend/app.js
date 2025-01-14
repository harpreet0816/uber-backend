const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes.js')
connectToDb();
// const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.use('/users', userRoutes);
// app.listen(port, ()=>{
//         console.log(`server is running on port: ${port}`)
//     })
module.exports = app;