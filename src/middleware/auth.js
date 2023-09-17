const jwt = require('jsonwebtoken');


// trên header của chúng ta sẽ có dạng: 
// Authorization: Bearner <token ở vị trí này>
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token)
        return res.status(401).json({ errCode: -1, messageEN: 'Token not found', messageVI: "Không tìm thấy token" })
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        req.roleId = decoded.roleId
        next()
    } catch (error) {
        console.log(error)
        return res.status(403).json({ errCode: -1, messageEN: 'invalid token', messageVI: "Token không hợp lệ" })
    }
}

module.exports = verifyToken