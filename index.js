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
const keyMap = require('./src/utils/constant/keyMap')

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

    socket.on("supplier-confirm-order", async ({ statusOrder, productId, senderId, receiverId, nameProduct }) => {
        let titleId, messageEn, messageVi, pageType
        if (statusOrder === keyMap.CHOXACNHAN_CHUATHANHTOAN || statusOrder === keyMap.CHOXACNHAN_DATHANHTOAN) {
            titleId = keyMap.DON_HANG_DUOC_XAC_NHAN
            pageType = 'CHOLAYHANG'
            messageEn = `The ${nameProduct} product you ordered has been successfully confirmed by the shop owner. Please wait for the shop owner to prepare the goods to send`
            messageVi = `Sản phẩm ${nameProduct} mà bạn đặt mua đã được chủ shop xác nhận đơn mua thành công. Vui lòng chờ chủ shop chuẩn bị hàng để gửi đi`
        } else if (statusOrder === keyMap.CHOLAYHANG_DATHANHTOAN || statusOrder === keyMap.CHOLAYHANG_CHUATHANHTOAN) {
            titleId = keyMap.DON_HANG_DANG_DUOC_GIAO
            pageType = 'DANGGIAO'
            messageEn = `The ${nameProduct} product has been sent by the shop owner to the shipping unit. Please check your incoming call to receive the goods from the shipping staff`
            messageVi = `Sản phẩm ${nameProduct} đã được chủ shop gửi cho đơn vị vận chuyển. Bạn hãy kiểm tra cuộc gọi đến để nhận hàng từ nhân viên vận chuyển`
        }
        await axios.post(`${process.env.URL_BACK_END}/api/craete-new-notify-socket`, {
            senderId: senderId,
            receiverId: receiverId,
            messageEn: messageEn,
            messageVi: messageVi,
            productId: productId,
            titleId: titleId,
            location: `Transaction_${pageType}`
        })
        arrSocketsNotifyServer.forEach(item => {
            if (item.userId === receiverId) {
                notifyServer.to(item.id).emit("update-notification")
            }
        })
    })

    socket.on("user-buy-product", async ({ productId, senderId, receiverId }) => {
        let messageEn = "Someone has ordered a product from your shop"
        let messageVi = `Có người đã đặt sản phẩm bên shop của bạn`
        await axios.post(`${process.env.URL_BACK_END}/api/craete-new-notify-socket`, {
            senderId: senderId,
            receiverId: receiverId,
            messageEn: messageEn,
            messageVi: messageVi,
            productId: productId,
            titleId: keyMap.DON_HANG_MOI
        })
        arrSocketsNotifyServer.forEach(item => {
            if (item.userId === receiverId) {
                notifyServer.to(item.id).emit("update-notification")
            }
        })
    })

    socket.on("user-cancel-buy-product", async ({ productId, senderId, receiverId, productName }) => {
        let messageEn = `Product ${productName} has been canceled by the buyer`
        let messageVi = `Sản phẩm ${productName} đã bị người mua hủy đơn hàng`
        await axios.post(`${process.env.URL_BACK_END}/api/craete-new-notify-socket`, {
            senderId: senderId,
            receiverId: receiverId,
            messageEn: messageEn,
            messageVi: messageVi,
            productId: productId,
            titleId: keyMap.DON_HANG_BI_HUY
        })
        arrSocketsNotifyServer.forEach(item => {
            if (item.userId === receiverId) {
                notifyServer.to(item.id).emit("update-notification")
            }
        })
    })


    socket.on("user-confirm-receive-product", async ({ productId, senderId, receiverId, productName }) => {
        let messageEn = `Product ${productName} has been delivered successfully`
        let messageVi = `Sản phẩm ${productName} đã được giao thành công`
        await axios.post(`${process.env.URL_BACK_END}/api/craete-new-notify-socket`, {
            senderId: senderId,
            receiverId: receiverId,
            messageEn: messageEn,
            messageVi: messageVi,
            productId: productId,
            titleId: keyMap.GIAO_HANG_THANH_CONG
        })
        arrSocketsNotifyServer.forEach(item => {
            if (item.userId === receiverId) {
                notifyServer.to(item.id).emit("update-notification")
            }
        })
    })

    socket.on("request-register-vendor", async ({ email, senderId }) => {
        let messageEn = `Account ${email} wants to register as an agent account`
        let messageVi = `Tài khoản ${email} muốn đăng ký thành tài khoản đại lý`
        await axios.post(`${process.env.URL_BACK_END}/api/craete-new-notify-socket`, {
            senderId: senderId,
            receiverId: 1,
            messageEn: messageEn,
            messageVi: messageVi,
            titleId: keyMap.HE_THONG
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