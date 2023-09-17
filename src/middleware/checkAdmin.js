const jwt = require('jsonwebtoken');
const keyMap = require("../utils/constant")

// trên header của chúng ta sẽ có dạng: 
// Authorization: Bearner <token ở vị trí này>
const checkAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    if (!token)
        return res.status(200).json({ errCode: -1, messageEN: 'Token not found', messageVI: "Không tìm thấy token" })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (decoded.roleId === keyMap.ADMIN) {
            req.userId = decoded.userId
            req.roleId = decoded.roleId
            next()
        } else {
            return res.status(200).json({ errCode: -1, messageEN: "You aren't admin", messageVI: "Bạn không phải quản trị viên" })
        }
    } catch (error) {
        console.log(error)
        return res.status(403).json({ errCode: -1, messageEN: 'Error form to check admin', messageVI: "Có lỗi khi kiểm tra quyền người dùng" })
    }
}

module.exports = checkAdmin