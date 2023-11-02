
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

            let response = await userService.registerInformation({ ...req.body, image: req?.file?.filename })
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
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }


    updateQuantityCart = async (req, res) => {
        try {
            let { cartId, quantity, productFee } = req.query
            if (!quantity || !cartId || !productFee) {
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
            let { productId, productTypeId, quantity, supplierId, productFee, time, statusId, shipFee } = req.body
            if (!productId || !quantity || !supplierId || !productFee || !time || !statusId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            console.log(req.body)
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
            let { cartId } = req.query
            if (!cartId) {
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

    buyProduct = async (req, res) => {
        try {
            let { productId, productTypeId, quantity, supplierId, productFee, shipFee, time, statusId, cartId } = req.body
            if (!productId || !quantity || !supplierId || !productFee || !shipFee || !time || !statusId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.buyProduct({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    setFollowShop = async (req, res) => {
        try {
            let { followedId } = req.body
            if (!followedId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.setFollowShop({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    setUnFollowShop = async (req, res) => {
        try {
            let { followedId } = req.body
            if (!followedId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.setUnFollowShop({ ...req.body, userId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getAllVouchersByUser = async (req, res) => {
        try {

            let response = await userService.getAllVouchersByUser({ ...req.query, userId: req.userId })
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

    getBanksForUser = async (req, res) => {
        try {

            let response = await userService.getBanksForUser({ userId: req.userId })
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

    createBankForUser = async (req, res) => {
        try {
            let { numberBank, nameBank, passVerify } = req.body
            if (!numberBank || !nameBank || !passVerify) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.createBankForUser({ ...req.body, userId: req.userId })
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

    verifyPassBankForUser = async (req, res) => {
        try {
            let { passVerify, bankId } = req.body
            if (!passVerify || !bankId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.verifyPassBankForUser({ ...req.body, userId: req.userId })
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

    getTransactionByUser = async (req, res) => {
        try {
            let { statusId } = req.query
            if (!statusId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.getTransactionByUser({ ...req.query, userId: req.userId })
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

    updateTransactionByUser = async (req, res) => {
        try {
            let { statusId } = req.query
            if (!statusId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.getTransactionByUser({ ...req.query, userId: req.userId })
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

    cancelBuyProduct = async (req, res) => {
        try {
            let { cartId } = req.query
            if (!cartId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.cancelBuyProduct({ ...req.query, userId: req.userId })
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

    reviewProductBought = async (req, res) => {
        try {
            let { reviewId, rating } = req.body
            if (!reviewId || !rating) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.reviewProductBought({ ...req.body, userId: req.userId })
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

    getListProductBoughtUnReviewByUser = async (req, res) => {
        try {
            let response = await userService.getListProductBoughtUnReviewByUser({ userId: req.userId })
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

    getNumberTransactionByUser = async (req, res) => {
        try {
            console.log("da chay vo")
            let response = await userService.getNumberTransactionByUser({ userId: req.userId })
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

    getHistoriesByUser = async (req, res) => {
        try {
            let response = await userService.getHistoriesByUser({ userId: req.userId })
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

    getListUserChatByUser = async (req, res) => {
        try {
            // let { receiverId } = req.query
            // if (!receiverId) {
            //     return res.status(200).json({
            //         errCode: 1,
            //         messageEN: "Missing information in request ",
            //         messageVI: "Thiếu thông tin chuyền lên "
            //     })
            // }
            let response = await userService.getListUserChatByUser({ ...req.query, userId: req.userId })
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

    getContentChatByUser = async (req, res) => {
        try {
            let { contactUserId } = req.query
            if (!contactUserId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.getContentChatByUser({ ...req.query, userId: req.userId })
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

    sendMessChatByUser = async (req, res) => {
        try {
            let { contactUserId, content } = req.body
            if (!contactUserId || !content) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.sendMessChatByUser({ ...req.body, userId: req.userId })
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

    getListNotifyByUser = async (req, res) => {
        try {
            let response = await userService.getListNotifyByUser({ userId: req.userId })
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

    deleteNotifyByNotifyId = async (req, res) => {
        try {
            let { notifyId } = req.query
            if (!notifyId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.deleteNotifyByNotifyId({ ...req.query, userId: req.userId })
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

    createNewNotity = async (req, res) => {
        try {
            let { receiverId, messageEn, messageVi, titleId, productId, location } = req.body
            if (!receiverId || !messageEn || !messageVi || !titleId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await userService.createNewNotity({ ...req.body, userId: req.userId })
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



    getNumberNotifycationByUser = async (req, res) => {
        try {

            let response = await userService.getNumberNotifycationByUser({ userId: req.userId })
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

    getNumberCartByUser = async (req, res) => {
        try {

            let response = await userService.getNumberCartByUser({ userId: req.userId })
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



module.exports = new userController()