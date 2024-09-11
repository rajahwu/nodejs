const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
require('dotenv').config();
const dbConnectionString = process.env.MONGODB_CONNECTION;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dbConnect(dbConnectionString)
    .then(() => console.log('db connected'))
    .catch(err => console.error(err));

const MessageSchema = new mongoose.Schema({
    name: String,
    message: String
});

const Message = mongoose.model('Message', MessageSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.send(messages);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/messages', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        console.log('saved');
        const censored = await Message.findOne({ message: 'badword' }); 

        if (censored) {
            await Message.deleteOne({ _id: censored._id });
        }  else {
            io.emit('message', req.body);
        }
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

async function dbConnect(conn) {
    await mongoose.connect(conn);
}

const server = http.listen(3000, () => console.log('server is listening on port', server.address().port));