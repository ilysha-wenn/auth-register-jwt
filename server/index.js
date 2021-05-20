require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const app = express();
const router = require('../server/routes/router');
const post = require('../server/routes/post')

const PORT = process.env.PORT || 3555;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use('/api', router);
app.use('/api', post);


const App = async() =>{
    try {
        mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
        app.listen(PORT, () => console.log(`Server start on ${PORT}`));
    } catch (error) {
        throw new Error(`Ошибка ${error}`);
    }
}
App();