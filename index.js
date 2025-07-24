const express = require('express');
const cors = require('cors')
require('dotenv').config()
require('./config/DBConnect'); 

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskroutes'));

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.send("Sever is running");
 })
