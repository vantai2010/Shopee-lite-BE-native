const adminService = require("../services/adminService")

class adminController {

    getProductByAdmin = async (req, res) => {
        try {

            let response = await adminService.getProductByAdmin(req.query)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getAllUsers = async (req, res) => {
        try {
            let { roleId } = req.query;

            if (!roleId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.getAllUsers(req.query)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    updateUserByAdmin = async (req, res) => {
        try {
            let { userId, roleId } = req.body;

            if (!userId || !roleId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.updateUserByAdmin({ ...req.body })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    deleteUserByAdmin = async (req, res) => {
        try {
            let { userId } = req.query;

            if (!userId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.deleteUserByAdmin(req.query)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    createNewUserByAdmin = async (req, res) => {
        try {
            let { email, password, firstName, lastName, address, phoneNumber, genderId, roleId } = req.body;

            if (!email || !password || !firstName || !lastName || !address || !phoneNumber || !genderId || !roleId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.createNewUserByAdmin({ ...req.body, image: req?.file?.filename })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    createNewNotitySocket = async (req, res) => {
        try {
            let { senderId, receiverId, messageEn, messageVi, titleId, productId, location, } = req.body
            if (!receiverId || !messageEn || !messageVi || !titleId || !senderId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.createNewNotitySocket(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    addNewVoucherByAdmin = async (req, res) => {
        try {
            let { userId, type, discount, conditionsPrice, timeEnd } = req.body
            if (!userId || !type || !discount || !conditionsPrice || !timeEnd) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await adminService.addNewVoucherByAdmin(req.body)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }
}



module.exports = new adminController()