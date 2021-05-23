const express = require('express');
const app = express();
const mongoose = require('mongoose');
const AuthRouter = require('./router/authRouter');

const PORT = process.env.PORT || 5000;
const DB_URL = 'mongodb+srv://user:user@cluster0.juveg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

app.use(express.json());
app.use('/api', AuthRouter);


const App = async () =>{
    try {
        await mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true});
        app.listen(PORT, console.log(`Сервер запущен: http://localhost:${PORT}`))
    } catch (error) {
        console.log(`Случилась ошибка: ${e}`);
    }
}
App();