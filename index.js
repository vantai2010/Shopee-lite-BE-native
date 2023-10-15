const express = require('express')
require('dotenv').config()
const app = express()
const cors = require('cors')
const PORT = 5000
const rootRouter = require('./src/routers/web')
const connectDB = require('./src/config/connectDB')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser');

const http = require('http').createServer(app)

const socketIO = require('socket.io')(http, {
    cors: {
        origin: '*',
        credentials: true
    }
});

const chatServer = socketIO.of('/chat')
const notifyServer = socketIO.of('/notify')

let arrSocketsNotifyServer = []

notifyServer.use((socket, next) => {
    const token = socket.handshake.auth.token;


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.userId = decoded.userId;
        socket.roleId = decoded.roleId;
        next();
    });
});

notifyServer.on('connection', (socket) => {
    // console.log(socket.handshake.auth.token)
    arrSocketsNotifyServer.push({
        id: socket.id,
        roleId: socket.roleId,
        userId: socket.userId
    })
    console.log(arrSocketsNotifyServer)
    notifyServer.emit('get-list-user-online', { listUserOnline: arrSocketsNotifyServer })



    socket.on('send-request-borrow', async ({ senderId }) => {
        arrSocketsNotifyServer.map(async (item) => {
            if (item.roleId === 'R1') {
                await axios.post(`${process.env.URL_BACK_END}/api/auth/add-one-notifycation-socket`, {
                    titleId: 'ST',
                    messageVi: "Có người dùng yêu cầu mượn sách",
                    messageEn: "Some users ask to borrow books",
                    receiverId: item.userId,
                    senderId: senderId
                })
                notifyServer.to(item.id).emit('update-notification')
                notifyServer.to(item.id).emit('update-list-manage')
            }
        })
    })

    socket.on('send-notify-to-user', ({ receiverId }) => {
        arrSocketsNotifyServer.map(item => {
            if (item.userId === receiverId) {
                notifyServer.to(item.id).emit('update-notification')
            }
        })
    })

    socket.on('argee-borrow-book', async ({ receiverId, bookName }) => {
        arrSocketsNotifyServer.map(async (item) => {
            if (item.userId === receiverId) {
                await axios.post(`${process.env.URL_BACK_END}/api/auth/add-one-notifycation-socket`, {
                    titleId: 'A',
                    messageVi: `Yêu cầu mượn sách ${bookName} của bạn đã thành công vui lòng đến thư viện gặp thủ thư để nhận sách`,
                    messageEn: `Request borrowing ${bookName} Successfully, please go to the library to meet the library to receive books`,
                    receiverId: item.userId
                })
                notifyServer.to(item.id).emit('update-notification')
            }
        })
    })


    socket.on('disconnect', () => {
        socket.disconnect();
        arrSocketsNotifyServer.map((item, index) => {
            if (item.id === socket.id) {
                arrSocketsNotifyServer.splice(index, 1)
            }
        })
        notifyServer.emit('get-list-user-online', { listUserOnline: arrSocketsNotifyServer })
        // console.log('botify: ', arrSocketsNotifyServer)
    });
});


chatServer.on('connection', (socket) => {

    socket.on('join-to-room-chat', ({ roomId }) => {
        if (roomId) {
            socket.join(roomId)
        }
    })

    socket.on('post-message', ({ roomId }) => {
        if (roomId) {
            chatServer.to(roomId).emit('update-comment')
        }
    })

    socket.on('delete-comment', ({ roomId }) => {
        if (roomId) {
            chatServer.to(roomId).emit('update-comment')
        }
    })

    socket.on('reply-comment', async ({ roomId, receiverId, senderId, firstNameSender, lastNameSender, bookId }) => {
        if (roomId) {
            chatServer.to(roomId).emit('update-comment')
            await axios.post(`${process.env.URL_BACK_END}/api/auth/add-one-notifycation-socket`, {
                titleId: 'Mess',
                messageEn: `${firstNameSender} ${lastNameSender} answer one of your comment`,
                messageVi: `${lastNameSender} ${firstNameSender} đã trả lời một bình luận của bạn`,
                receiverId: receiverId,
                senderId: senderId,
                location: `/infor-book/${bookId}`
            })
            let receiverUser = arrSocketsNotifyServer.find(item => item.userId === receiverId)
            notifyServer.to(receiverUser?.id).emit('update-notification')
        }
    })

    socket.on('test', () => {
        socket.emit('okTest', 10)
    })

    socket.on('disconnect', () => {
        socket.disconnect();
    });
});


connectDB()

app.use(express.json({ limit: '50mb' }))
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({ origin: true }))
app.use(express.static('public'))
app.use(express.json())

app.use('/api', rootRouter)

http.listen(PORT, () => console.log('listening on port', PORT))