
const userService = require("../services/userService")

class userController {

    registerAccount = async (req, res) => {
        try {
            let { email, password, rePassword, language } = req.body;

            if (!email || !password || !rePassword || !language) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            if (password !== rePassword) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Repassword invalid",
                    messageVI: "Mật khẩu nhập lại không đúng"
                })
            }

            let response = await userService.registerAccount(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    registerInformation = async (req, res) => {
        try {
            let { accountId, firstName, lastName, address, phoneNumber, genderId, image } = req.body;

            if (!accountId || !firstName || !lastName || !address || !phoneNumber || !genderId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await userService.registerInformation(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    loginAccount = async (req, res) => {
        try {
            let { email, password } = req.body;

            if (!email || !password) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await userService.loginAccount(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

}



module.exports = new userController()