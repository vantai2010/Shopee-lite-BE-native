
const userService = require("../services/userService")

class userController {

    registerAccount = async (req, res) => {
        try {
            let { email, password, rePassword } = req.body;
            if (!email || !password || !rePassword) {
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
            console.log(error.message)
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    loginAccountWithToken = async (req, res) => {
        try {
            let { userId } = req;

            if (!userId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await userService.loginAccountWithToken({ roleId: req.roleId, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    updateInformation = async (req, res) => {
        try {
            let { firstName, lastName, address, phoneNumber, genderId } = req.body;

            if (!firstName || !lastName || !address || !phoneNumber || !genderId || !nameBank || !numberBank) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await userService.updateInformation({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    updateBankForUser = async (req, res) => {
        try {
            let { nameBank, numberBank } = req.body;

            if (!nameBank || !numberBank) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await userService.updateBankForUser({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getAllCart = async (req, res) => {
        try {
            let response = await userService.getAllCart({ userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }


    updateQuantityCart = async (req, res) => {
        try {
            let { cartId, quantity } = req.query
            if (!quantity || !cartId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.updateQuantityCart(req.query)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    addMoney = async (req, res) => {
        try {
            let { passVerify, money } = req.query
            if (!passVerify || !money) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.addMoney({ ...req.query, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    pushProductToCart = async (req, res) => {
        try {
            let { productId, productType, quantity, supplierId, totalPaid, time } = req.body
            if (!productId || !quantity || !supplierId || !totalPaid || !time) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.pushProductToCart({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    deleteProductFromCart = async (req, res) => {
        try {
            let { cartdId } = req.query
            if (!cartdId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.deleteProductFromCart({ ...req.query, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    confirmReceivedProduct = async (req, res) => {
        try {
            let { cartId } = req.body
            if (!cartId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.confirmReceivedProduct({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    reviewProduct = async (req, res) => {
        try {
            let { reviewId, rating, comment, time } = req.body
            if (!reviewId || !rating || !comment || !time) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.reviewProduct({ ...req.body, userId: req.userId })
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