const keyMap = require("../utils/constant/keyMap")
const db = require("../models/index")
const argon2 = require("argon2")
const moment = require("moment")
const jwt = require("jsonwebtoken")
const { Op, Sequelize } = require('sequelize')
const { handleCheckUpdate, handleCheckCreate, handleCheckDelete } = require("../utils/verifyORM/checkResult")
const handleFindNearestTime = require("../utils/handleFindNearestTime")
require('dotenv').config()

class userService {

    registerAccount = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { email, password } = data

                let checkEmail = await db.Account.findOne({
                    where: { email: email }
                })
                if (checkEmail) {
                    resolve({
                        errCode: 1,
                        messageEN: "This Email is already registered !",
                        messageVI: "Email này đã được sử dụng !"
                    })
                } else {
                    let hashPassword = await argon2.hash(password)
                    let check = await db.Account.create({
                        email: email,
                        password: hashPassword,
                        roleId: keyMap.USER,
                    })
                    if (!check) {
                        resolve({
                            errCode: -1,
                            messageEN: "Registration failed",
                            messageVI: "Đăng ký thất bại"
                        })
                    } else {
                        // await emailService.sendEmailRegister({ reciverEmail: email, accountId: check.id, language })
                        resolve({
                            errCode: 0,
                            messageEN: "Registration successful",
                            messageVI: "Vui lòng kiểm tra email để xác thực",
                            accountId: check.id
                        })
                    }
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    registerInformation = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { accountId, firstName, lastName, address, phoneNumber, genderId, image } = data
                let checkCreate = await db.User.create({
                    accountId: accountId,
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    phoneNumber: phoneNumber,
                    genderId: genderId,
                    image: image
                })
                if (checkCreate) {

                    resolve({
                        errCode: 0,
                        messageEN: "You have successfully registered an account!",
                        messageVI: "Bạn đã đăng ký tài khoản thành công !"
                    })

                } else {
                    resolve({
                        errCode: -1,
                        messageEN: "Server error, personal information registration failed!",
                        messageVI: "Lỗi từ máy chủ, đăng ký thông tin cá nhân thất bại !"
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    loginAccount = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { email, password } = data
                let checkEmailExist = await db.Account.findOne({
                    where: { email: email }
                })
                if (!checkEmailExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Email not found",
                        messageVI: "Tài khoản này không tồn tại"
                    })
                } else {
                    let passwordVerify = await argon2.verify(checkEmailExist.password, password)

                    if (!passwordVerify) {
                        resolve({
                            errCode: 1,
                            messageEN: "Password verification failed",
                            messageVI: "Mật khẩu không chính xác"
                        })
                    } else {
                        let user = await db.User.findOne({
                            where: { accountId: checkEmailExist.id },
                            raw: true
                        })

                        if (!user) {
                            resolve({
                                errCode: 1,
                                messageEN: "Information user not found",
                                messageVI: "Không tìm thấy thông tin người dùng"
                            })
                        } else {
                            let followingUserNumber = await db.Interact.count({
                                where: { followedId: user.id }
                            })
                            let followedUserNumber = await db.Interact.count({
                                where: { followerId: user.id }
                            })

                            console.log({ ...user, roleId: checkEmailExist.roleId, email: email, followingUserNumber, followedUserNumber })
                            console.log()
                            let token = jwt.sign({ userId: user.id, roleId: checkEmailExist.roleId }, process.env.ACCESS_TOKEN_SECRET)
                            resolve({
                                errCode: 0,
                                messageEN: "Login successfully",
                                messageVI: "Đăng nhập thành công",
                                data: { ...user, roleId: checkEmailExist.roleId, email: email, followingUserNumber, followedUserNumber },
                                token: token,
                            })
                        }
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    loginAccountWithToken = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let userData = await db.User.findOne({
                    where: { id: data.userId },
                    raw: true
                })
                if (!userData) {
                    resolve({
                        errCode: 1,
                        messageEN: "User information not found",
                        messageVI: "Không tìm thấy thông tin người dùng"
                    })
                } else {
                    let userAccountData = await db.Account.findOne({
                        where: { id: userData.accountId }
                    })
                    //so luong nguoi theo doi minh
                    let followingUserNumber = await db.Interact.count({
                        where: { followedId: userData.id }
                    })
                    // so luong nguoi minh dang theo doi
                    let followedUserNumber = await db.Interact.count({
                        where: { followerId: userData.id }
                    })
                    resolve({
                        errCode: 0,
                        messageEN: "Login successfully",
                        messageVI: "Đăng nhập thành công",
                        data: { ...userData, roleId: data.roleId, email: userAccountData.email, followingUserNumber, followedUserNumber }
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    updateInformation = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, firstName, lastName, address, phoneNumber, genderId } = data;
                let user = await db.User.findOne({
                    where: { id: userId }
                })
                if (!user) {
                    resolve({
                        errCode: 1,
                        messageEN: "User not found",
                        messageVI: "Không tìm thấy thông tin người dùng này"
                    })
                } else {
                    user.firstName = firstName
                    user.lastName = lastName
                    user.address = address
                    user.phoneNumber = phoneNumber
                    user.genderId = genderId
                    user.image = image
                    let checkUpdate = await user.save()
                    if (!checkUpdate) {
                        resolve({
                            errCode: -1,
                            messageEN: "Update failed",
                            messageVI: "Cập nhật thông tin thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Update successfully",
                            messageVI: "Cập nhật thông tin thành công"
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    updateBankForUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, nameBank, numberBank, oldPassVerify, newPassVerify } = data;
                let userData = await db.Bank.findOne({
                    userId: userId,
                })
                if (!userData) {
                    resolve({
                        errCode: -1,
                        messageEN: "Information not found",
                        messageVI: "Thông tin không được tìm thấy"
                    })
                } else if (!oldPassVerify && !newPassVerify) {
                    userData.nameBank = nameBank
                    userData.numberBank = numberBank
                    let checkUpdate = await userData.save()
                    if (!checkUpdate) {
                        resolve({
                            errCode: -1,
                            messageEN: "Updating bank information failed ",
                            messageVI: "Cập nhật thông tin ngân hàng thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Updating bank information successfully ",
                            messageVI: "Cập nhật thông tin ngân hàng thành công"
                        })
                    }
                } else {
                    let checkOldPass = await argon2.verify(userData.passVerify, oldPassVerify)
                    if (!checkOldPass) {
                        resolve({
                            errCode: 1,
                            messageEN: "The old confirmation code you entered is incorrect",
                            messageVI: "Mã xác nhận cũ bạn nhập không chính xác"
                        })
                    } else {
                        let passHashed = await argon2.hash(newPassVerify)
                        userData.nameBank = nameBank
                        userData.numberBank = numberBank
                        userData.passVerify = passHashed
                        let checkUpdate = await userData.save()
                        if (!checkUpdate) {
                            resolve({
                                errCode: -1,
                                messageEN: "Updating bank information failed ",
                                messageVI: "Cập nhật thông tin ngân hàng thất bại"
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                messageEN: "Updating bank information successfully ",
                                messageVI: "Cập nhật thông tin ngân hàng thành công"
                            })
                        }
                    }
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    getAllCart = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let dataCart = await db.Cart.findAll({
                    where: { userId: userId, statusId: keyMap.TRONGGIO },
                    include: [
                        {
                            model: db.Product,
                            as: "productCartData",
                            attributes: ["id", "name", "image", "price"],
                            include: [
                                {
                                    model: db.Product_Type,
                                    as: "productTypeData",
                                    attributes: ["id", "type", "size"]
                                },
                                {
                                    model: db.User,
                                    as: "productSupplierData",
                                    attributes: ["address"]
                                }
                            ]
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeCartData"
                        }
                    ],
                    // raw: true
                })
                if (!dataCart) {
                    resolve({
                        errCode: 1,
                        messageEN: "Retrieving cart information failed",
                        messsageVI: "Lấy thông tin giỏ hàng thất bại"
                    })
                } else {

                    resolve({
                        errCode: 0,
                        messageEN: "Retrieve shopping cart information successfully",
                        messageVI: "Lấy thông tin giỏ hàng thành công",
                        data: dataCart
                    })

                }
            } catch (error) {
                reject(error);
            }
        })
    }


    updateQuantityCart = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId, quantity, productFee } = data
                let cartData = await db.Cart.findOne({
                    where: { id: cartId }
                })
                if (!cartData) {
                    resolve({
                        errCode: 1,
                        messageEN: "No matching cart information found",
                        messageVI: "Không tìm thấy thông tin giỏ hàng phù hợp"
                    })
                } else {
                    cartData.quantity = quantity
                    cartData.productFee = productFee
                    let checkUpdate = await cartData.save()
                    if (!checkUpdate) {
                        resolve({
                            errCode: -1,
                            messageEN: "Error updating",
                            messageVI: "Có lỗi trong quá trình cập nhật"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Update successfully",
                            messageVI: "Cập nhật thành công"
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    addMoney = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, passVerify, money } = data
                let dataUser = await db.User.findOne({ id: userId })
                let dataBankOfUser = await db.Bank.findOne({ userId: userId })
                if (!dataUser && !dataBankOfUser) {
                    resolve({
                        errCode: 1,
                        messageEN: "No matching users were found",
                        messageVI: "không tìm thấy người dùng phù hợp"
                    })
                } else {
                    let checkPass = await argon2.verify(dataBankOfUser.passVerify, passVerify)
                    if (!checkPass) {
                        resolve({
                            errCode: 1,
                            messageEN: "Authentication code is incorrect",
                            messageVI: "Mã xác thực không đúng"
                        })
                    } else {
                        dataUser.money = dataUser.money + money
                        let checkUpdate = await dataUser.save()
                        resolve(handleCheckUpdate(checkUpdate))
                    }
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    pushProductToCart = (data) => {
        return new Promise(async (resolve, reject) => {

            try {
                let { productId, productTypeId, quantity, userId, supplierId, productFee, time, statusId, shipFee } = data

                if (statusId === keyMap.TRONGGIO) {
                    let checkNumber = await db.Cart.count({
                        where: { userId: userId, statusId: statusId }
                    })
                    if (checkNumber > 10) {
                        resolve({
                            errCode: 1,
                            messageEN: "Your cart is full of items",
                            messageVI: "Giỏ hàng đã đầy"
                        })
                    } else {
                        let checkExistCart = await db.Cart.findOne({
                            where: { userId: userId, statusId: keyMap.TRONGGIO, productId: productId }
                        })
                        if (!checkExistCart) {
                            let checkCreate = await db.Cart.create({
                                productId: productId,
                                productTypeId: productTypeId,
                                quantity: quantity,
                                userId: userId,
                                statusId: statusId,
                                supplierId: supplierId,
                                productFee: productFee,
                                shipFee: shipFee,
                                time: time,
                                timeStart: time
                            })
                            let numberCart = await db.Cart.count({
                                where: { userId: userId, statusId: keyMap.TRONGGIO }
                            })
                            if (checkCreate) {
                                resolve({
                                    errCode: 0,
                                    messageEN: "Add product to cart successfully",
                                    messageVI: "Thêm sản phẩm vào dỏ thành công",
                                    numberCart: numberCart
                                })
                            } else {
                                resolve({
                                    errCode: 1,
                                    messageEN: "Add product to cart failed",
                                    messageVI: "Thêm sản phẩm vào giỏ hàng thất bại"
                                })
                            }
                        } else {
                            checkExistCart.quantity = quantity
                            checkExistCart.productTypeId = productTypeId
                            checkExistCart.time = moment().format(keyMap.FORMAT_TIME)
                            let checkUpdate = await checkExistCart.save()
                            let numberCart = await db.Cart.count({
                                where: { userId: userId, statusId: keyMap.TRONGGIO }
                            })
                            if (checkUpdate) {
                                resolve({
                                    errCode: 0,
                                    messageEN: "Add product to cart successfully",
                                    messageVI: "Thêm sản phẩm vào dỏ thành công",
                                    numberCart: numberCart
                                })
                            } else {
                                resolve({
                                    errCode: 1,
                                    messageEN: "Add product to cart failed",
                                    messageVI: "Thêm sản phẩm vào giỏ hàng thất bại"
                                })
                            }
                        }
                    }
                } else if (statusId === keyMap.CHOXACNHAN_DATHANHTOAN || statusId === keyMap.CHOXACNHAN_CHUATHANHTOAN) {
                    let checkExistCart = await db.Cart.findOne({
                        where: {
                            [Op.or]: [
                                { statusId: keyMap.CHOXACNHAN_DATHANHTOAN },
                                { statusId: keyMap.CHOXACNHAN_CHUATHANHTOAN }
                            ],
                            userId: userId,
                            productId: productId,
                            productTypeId: productTypeId,
                        }
                    })
                    if (checkExistCart) {
                        resolve({
                            errCode: 1,
                            messageEN: "You have already ordered this item, please check again",
                            messageVI: "Mặt hàng này bạn đã đặt hàng rồi, Vui lòng kiểm tra lại"
                        })
                    } else {
                        let checkCreate = await db.Cart.create({
                            productId: productId,
                            productTypeId: productTypeId,
                            quantity: quantity,
                            userId: userId,
                            statusId: statusId,
                            supplierId: supplierId,
                            productFee: productFee,
                            shipFee: shipFee,
                            time: time,
                            timeStart: time
                        })
                        resolve(handleCheckCreate(checkCreate))
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteProductFromCart = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId } = data

                let optionsFind = {}
                if (Array.isArray(cartId)) {
                    optionsFind = {
                        id: {
                            [Op.in]: cartId
                        }
                    }
                } else {
                    optionsFind = { id: cartId }
                }

                let checkExist = await db.Cart.findOne({
                    where: optionsFind
                })

                if (!checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    let checkDelete = await db.Cart.destroy({
                        where: optionsFind
                    })
                    resolve(handleCheckDelete(checkDelete))
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    confirmReceivedProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId } = data
                // console.log(cartId, "check confirm")
                let checkCart = await db.Cart.findOne({
                    where: { id: cartId }
                })
                if (checkCart) {
                    let checkDelete = await db.Cart.destroy({ where: { id: cartId } })
                    if (checkDelete) {
                        let checkCreate = await db.History.create({
                            userId: checkCart.userId,
                            productId: checkCart.productId,
                            supplierId: checkCart.supplierId,
                            productTypeId: checkCart.productTypeId,
                            productFee: checkCart.productFee,
                            shipFee: checkCart.shipFee,
                            startTime: checkCart.timeStart,
                            endTime: moment().format(keyMap.FORMAT_TIME),
                        })
                        let idReview
                        let checkReviewExist = await db.Review.findOne({
                            where: {
                                userId: checkCart.userId,
                                productId: checkCart.productId,
                                productTypeId: checkCart.productTypeId,
                            }
                        })
                        if (!checkReviewExist) {
                            let checkCreateReview = await db.Review.create({
                                userId: checkCart.userId,
                                productId: checkCart.productId,
                                productTypeId: checkCart.productTypeId,
                                rating: 0
                            })
                            idReview = checkCreateReview.id
                        } else {
                            idReview = checkReviewExist.id
                        }

                        // console.log(idReview, "id review")
                        if (!checkCreate) {
                            resolve({
                                errCode: 1,
                                messageEN: "Update transaction to failure history",
                                messageVI: "Cập nhật giao dịch vào lịch sử thất bại"
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                messageEN: "Confirm successful transaction",
                                messageVI: "Xác nhận giao dịch thành công",
                                reviewId: idReview
                            })

                        }
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "There is a problem with the processing process on the system",
                            messageVI: "Qúa trình xử lý trên hệ thông có trục trặc"
                        })
                    }
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "No compatibility information found",
                        messageVI: "Không tìm thấy thông tin tương thích"
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    reviewProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { reviewId, rating, comment, time } = data
                let review = await db.Review.findOne({ where: { id: reviewId } })
                if (!review) {
                    resolve({
                        errCode: 1,
                        messageEN: "",
                        messageVI: "Không tìm thấy thông tin phù hợp"
                    })
                } else {
                    review.rating = rating
                    review.comment = comment
                    review.time = time
                    let checkUpdate = await review.save()
                    resolve(handleCheckUpdate(checkUpdate))
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    buyProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, productTypeId, quantity, userId, supplierId, productFee, shipFee, time, statusId, cartId } = data

                let productSelected = await db.Product.findOne({ where: { id: productId } })
                let productTypeSelected = await db.Product_Type.findOne({ where: productTypeId ? { id: productTypeId } : {} })
                if (!productSelected || !productTypeSelected) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Sản phẩm không được tìm thấy"
                    })
                } else if (productSelected.quantity < quantity || productTypeSelected.quantity < quantity) {
                    resolve({
                        errCode: 2,
                        messageEN: "The quantity of products is not enough to meet the demand",
                        messageVI: "Số lượng sản phẩm không đủ đáp ứng"
                    })
                } else if (statusId === keyMap.CHOXACNHAN_DATHANHTOAN || statusId === keyMap.CHOXACNHAN_CHUATHANHTOAN) {
                    let checkExistCart = await db.Cart.findOne({
                        where: {
                            [Op.or]: [
                                { statusId: keyMap.CHOXACNHAN_DATHANHTOAN },
                                { statusId: keyMap.CHOXACNHAN_CHUATHANHTOAN }
                            ],
                            userId: userId,
                            productId: productId,
                            productTypeId: productTypeId,
                        }
                    })
                    if (checkExistCart) {
                        resolve({
                            errCode: 1,
                            messageEN: "You have already ordered this item, please check again",
                            messageVI: "Mặt hàng này bạn đã đặt hàng rồi, Vui lòng kiểm tra lại"
                        })
                    } else {
                        {
                            productSelected.quantity = productSelected.quantity - quantity
                            productTypeSelected.quantity = productTypeSelected.quantity - quantity
                            let checkUpdateQuantityProduct = await productSelected.save()
                            let checkUpdateQuantityProductType = await productTypeSelected.save()
                            if (!checkUpdateQuantityProduct || !checkUpdateQuantityProductType) {
                                resolve({
                                    errCode: 2,
                                    messageEN: "The product purchasing process has problems",
                                    messageVI: "Quy trình mua sản phẩm gặp trục trặc"
                                })
                            } else {
                                if (cartId) {
                                    await db.Cart.destroy({ where: { id: cartId } })
                                }

                                let checkCreate = await db.Cart.create({
                                    productId: productId,
                                    productTypeId: productTypeId,
                                    quantity: quantity,
                                    userId: userId,
                                    statusId: statusId,
                                    supplierId: supplierId,
                                    productFee: productFee,
                                    shipFee: shipFee,
                                    time: time,
                                    timeStart: time
                                })
                                if (checkCreate) {
                                    resolve({
                                        errCode: 0,
                                        messageEN: "Order the product quickly and successfully",
                                        messageVI: "Đặt mua sản phẩm thành công"
                                    })
                                } else {
                                    resolve({
                                        errCode: 2,
                                        messageEN: "Product order failed",
                                        messageVI: "Đặt mua sản phẩm thất bại"
                                    })
                                }
                            }
                        }
                    }

                }


            } catch (error) {
                reject(error);
            }
        })
    }

    setFollowShop = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { followedId, userId } = data
                let checkExist = await db.Interact.findOne({ where: { followedId: followedId, followerId: userId } })
                if (checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Interaction is exist",
                        messageVI: "Tương tác này đã tồn tại"
                    })
                } else {
                    let checkCreate = await db.Interact.create({
                        followedId: followedId,
                        followerId: userId
                    })
                    resolve(handleCheckCreate(checkCreate))
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    setUnFollowShop = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { followedId, userId } = data
                let checkExist = await db.Interact.findOne({ where: { followedId: followedId, followerId: userId } })
                if (!checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Interaction isn't exist",
                        messageVI: "Tương tác này chưa tồn tại"
                    })
                } else {
                    let checkDelete = await db.Interact.destroy({
                        where: {
                            followedId: followedId,
                            followerId: userId
                        }
                    })
                    resolve(handleCheckDelete(checkDelete))
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getAllVouchersByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, userId } = data
                let optionFind = {}
                // console.log(moment(new Date()).format(keyMap.FORMAT_TIME))
                if (productId) {
                    optionFind = {
                        [Op.or]: [
                            { userId: userId },
                            { productId: productId }
                        ],
                        timeEnd: {
                            [Op.gt]: moment(new Date()).format(keyMap.FORMAT_TIME),
                        },
                    }
                } else {
                    optionFind = {
                        userId: userId,
                        timeEnd: {
                            [Op.gt]: moment(new Date()).format(keyMap.FORMAT_TIME),
                        },
                    }
                }
                let vourcherData = await db.Promotion.findAll({
                    where: optionFind
                })
                if (!vourcherData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Vouchers not found",
                        messageVI: "Không tìm thấy mã giảm giá"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get vouchers success",
                        messageVI: "Lấy mã giảm giá thành công",
                        data: vourcherData
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getBanksForUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let bankData = await db.Bank.findAll({
                    where: { userId: userId },
                    attributes: ["id", "userId", "numberBank", "nameBank"]
                })
                if (!bankData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information Not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get information success",
                        messageVI: "Lấy thông tin thành công",
                        data: bankData
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    createBankForUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { numberBank, nameBank, passVerify, userId } = data
                console.log(data)
                let checkExist = await db.Bank.findOne({
                    where: {
                        userId: userId,
                        numberBank: numberBank,
                        nameBank: nameBank,
                    }
                })
                if (checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "This bank is exist",
                        messageVI: "Tài khoản này đã tồn tại"
                    })
                } else {
                    let passHashed = await argon2.hash(passVerify)
                    let checkCreate = await db.Bank.create({
                        userId: userId,
                        numberBank: numberBank,
                        nameBank: nameBank,
                        passVerify: passHashed
                    })
                    resolve(handleCheckCreate(checkCreate))
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    verifyPassBankForUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { bankId, passVerify } = data
                let checkExist = await db.Bank.findOne({
                    where: { id: bankId }
                })
                if (!checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "This bank isn't exist",
                        messageVI: "Tài khoản không tồn tại"
                    })
                } else {
                    let check = await argon2.verify(checkExist.passVerify, passVerify)
                    if (!check) {
                        resolve({
                            errCode: 2,
                            messageEN: "Authentication code is incorrect",
                            messageVI: "Mã xác thực không đúng"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Authentication code is success",
                            messageVI: "Xác thực thành công"
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getTransactionByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { statusId, userId } = data
                let optionFind = {}
                if (statusId === "CHOXACNHAN") {
                    optionFind = {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.CHOXACNHAN_CHUATHANHTOAN },
                            { statusId: keyMap.CHOXACNHAN_DATHANHTOAN }
                        ]
                    }
                } else if (statusId === "CHOLAYHANG") {
                    optionFind = {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.CHOLAYHANG_CHUATHANHTOAN },
                            { statusId: keyMap.CHOLAYHANG_DATHANHTOAN }
                        ]
                    }
                } else if (statusId === "DANGGIAO") {
                    optionFind = {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.DANGSHIP_CHUATHANHTOAN },
                            { statusId: keyMap.DANGSHIP_DATHANHTOAN }
                        ]
                    }
                } else {
                    optionFind = { statusId: statusId, userId: userId }
                }

                let transData = await db.Cart.findAll({
                    where: optionFind,
                    include: [
                        {
                            model: db.Product,
                            as: "productCartData",
                            attributes: ["id", "name", "image",],
                            // where: optionsFindProductName
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeCartData",
                            attributes: ["id", "type", "size"],
                            // where: optionsFindUserName
                        },
                        {
                            model: db.User,
                            as: "userSupplierCartData",
                            attributes: ["firstName", "lastName"],
                            // where: optionsFindUserName
                        }
                    ],
                })
                if (!transData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get Information successfully",
                        messageVI: "Lấy thông tin thành công",
                        data: transData
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    cancelBuyProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId, userId } = data
                let checkCart = await db.Cart.findOne({ where: { id: cartId } })
                if (!checkCart) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else if (checkCart.statusId === keyMap.CHOXACNHAN_DATHANHTOAN || checkCart.statusId === keyMap.CHOXACNHAN_CHUATHANHTOAN) {
                    let checkDelete = await db.Cart.destroy({ where: { id: cartId } })
                    if (!checkDelete) {
                        resolve({
                            errCode: 1,
                            messageEN: "Order cancellation failed",
                            messageVI: "Hủy đơn hàng thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Order cancellation succeeded",
                            messageVI: "Hủy đơn hàng thành công"
                        })
                    }
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Order cancellations cannot be made during this period",
                        messageVI: "Không thể thực hiện hủy đơn hàng trong giai đoạn này"
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    reviewProductBought = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { reviewId, rating, comment } = data
                let reviewSelected = await db.Review.findOne({
                    where: { id: reviewId }
                })
                if (!reviewSelected) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    reviewSelected.time = moment().format(keyMap.FORMAT_TIME)
                    reviewSelected.rating = rating
                    reviewSelected.comment = comment
                    let checkUpdate = await reviewSelected.save()
                    if (!checkUpdate) {
                        resolve({
                            errCode: 1,
                            messageEN: "The evaluation process encountered problems",
                            messageVI: "Qúa trình đánh giá gặp trục trặc"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Successful product reviews",
                            messageVI: "Đánh giá sản phẩm thành công"
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getListProductBoughtUnReviewByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let listProduct = await db.Review.findAll({
                    where: { userId: userId, rating: 0 },
                    include: [
                        {
                            model: db.Product,
                            as: "productReviewData",
                            attributes: ["id", "name", "image"],
                            include: [
                                {
                                    model: db.User,
                                    as: "productSupplierData",
                                    attributes: ["firstName", "lastName"]
                                }
                            ]
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeReviewData",
                            attributes: ["id", "type", "size"]
                        }
                    ]
                })
                if (!listProduct) {
                    resolve({
                        errCode: 1,
                        messageEN: "Retrieve data failed",
                        messageVI: "Lấy dữ liệu thất bại"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Retrieve data successfully",
                        messageVI: "Lấy dữ liệu thành công",
                        data: listProduct
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getNumberTransactionByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let numberTransCHOXACNHAN = await db.Cart.count({
                    where: {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.CHOXACNHAN_DATHANHTOAN },
                            { statusId: keyMap.CHOXACNHAN_CHUATHANHTOAN }
                        ]
                    }
                })
                let numberTransCHOLAYHANG = await db.Cart.count({
                    where: {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.CHOLAYHANG_DATHANHTOAN },
                            { statusId: keyMap.CHOLAYHANG_CHUATHANHTOAN }
                        ]
                    }
                })
                let numberTransDANGGIAO = await db.Cart.count({
                    where: {
                        userId: userId,
                        [Op.or]: [
                            { statusId: keyMap.DANGSHIP_CHUATHANHTOAN },
                            { statusId: keyMap.DANGSHIP_DATHANHTOAN }
                        ]
                    }
                })
                let numberTransDANHGIA = await db.Review.count({
                    where: {
                        userId: userId,
                        rating: 0
                    }
                })

                console.log(numberTransDANHGIA, numberTransCHOXACNHAN, numberTransDANGGIAO, numberTransCHOLAYHANG)
                resolve({
                    errCode: 0,
                    messageEN: "Get information successfully",
                    messageVI: "Lấy thông tin thành công",
                    data: {
                        numberTransDANHGIA,
                        numberTransCHOXACNHAN,
                        numberTransDANGGIAO,
                        numberTransCHOLAYHANG
                    }
                })

            } catch (error) {
                reject(error);
            }
        })
    }

    getHistoriesByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let historiesData = await db.History.findAll({
                    where: { userId: userId },
                    include: [
                        {
                            model: db.User,
                            as: "supplierHistoryData",
                            attributes: ["firstName", "lastName", "address"]
                        },
                        {
                            model: db.Product,
                            as: "productHistoryData",
                            attributes: ["id", "name", "image"]
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeHistoryData",
                            attributes: ["id", "type", "size"]
                        }
                    ]
                })
                if (!historiesData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get list of histories successfully",
                        messageVI: "Lấy danh sách lịch sử thành công",
                        data: historiesData
                    })
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    getListUserChatByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, search } = data
                let optionFind
                if (search) {
                    optionFind = {
                        [Op.and]: [
                            {
                                [Op.or]: [
                                    { senderId: userId },
                                    { receiverId: userId }
                                ]
                            },
                            {
                                [Op.or]: [
                                    { firstName: { [Op.iLike]: `%${search}%` } },
                                    { lastName: { [Op.iLike]: `%${search}%` } }
                                ]
                            }
                        ]
                    }
                } else {
                    optionFind = {
                        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
                    }
                }

                let contacts = await db.Chat.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.literal('CASE WHEN "senderId" = ' + userId + ' THEN "receiverId" ELSE "senderId" END')), 'contactId'],
                        "time", "content"
                    ],
                    where: optionFind,
                    raw: true
                });

                let listUserContact = await db.User.findAll({
                    where: {
                        id: {
                            [Op.in]: contacts.map(item => item.contactId)
                        }
                    },
                    attributes: ["id", "firstName", "lastName", "image"]
                })

                let contactsFormat = []
                contacts.forEach(contact => {
                    let checkExist = contactsFormat.find(item => item.contactId === contact.contactId)
                    if (checkExist) {
                        let timeNearest = handleFindNearestTime(contact.time, checkExist.time)
                        if (timeNearest === contact.time) {
                            contactsFormat = contactsFormat.filter(item => item.contactId !== checkExist.contactId)
                            contactsFormat.push(contact);
                        }
                    } else {
                        contactsFormat.push(contact)
                    }
                })

                listUserContact = listUserContact.map(item => {
                    let bodyContact = contactsFormat.find(contact => contact.contactId === item.id)
                    return {
                        id: item.id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        image: item.image,
                        time: bodyContact.time,
                        content: bodyContact.content
                    }
                })

                if (!contacts) {
                    resolve({
                        errCode: 1,
                        messageEN: "Contact not found",
                        messageVI: "Không tìm thấy tương tác nào"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "get list of contacts successfully",
                        messageVI: "Lấy danh sách tương tác thành công",
                        data: listUserContact
                    })
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    getContentChatByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { contactUserId, userId } = data

                let contentChat = await db.Chat.findAll({
                    where: {
                        [Op.and]: [
                            { [Op.or]: [{ senderId: userId }, { receiverId: userId }] },
                            { [Op.or]: [{ senderId: contactUserId }, { receiverId: contactUserId }] },
                        ]
                    }
                })
                if (!contentChat) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get content chat successfully",
                        messageVI: "Lấy nội dung chát thành công",
                        data: contentChat
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    sendMessChatByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { contactUserId, content, userId } = data
                let checkCreate = await db.Chat.create({
                    senderId: userId,
                    receiverId: contactUserId,
                    content: content,
                    time: moment().format(keyMap.FORMAT_TIME)
                })
                resolve(handleCheckCreate(checkCreate))
            } catch (error) {
                reject(error);
            }
        })
    }

    getListNotifyByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let checkCreate = await db.Notifycation.findAll({
                    where: { receiverId: userId },
                    include: [
                        {
                            model: db.Product,
                            as: "notifyProductData",
                            attributes: ["id", "image", "name"]
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                })
                if (!checkCreate) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get information successfully",
                        messageVI: "Lấy thông tin thành công",
                        data: checkCreate
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteNotifyByNotifyId = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { notifyId, userId } = data
                let checkExist = await db.Notifycation.findOne({
                    where: { id: notifyId }
                })
                if (!checkExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    let checkDelete = await db.Notifycation.destroy({ where: { id: notifyId } })
                    let numberNotify = await db.Notifycation.count({ where: { receiverId: userId } })
                    if (!checkDelete) {
                        resolve({
                            errCode: 1,
                            messageEN: "Delete information failed",
                            messageVI: "Xóa thông báo thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Delete information successfully",
                            messageVI: "Xóa thông báo thành công",
                            numberNotify: numberNotify
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    createNewNotity = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { receiverId, messageEn, messageVi, titleId, productId, location, userId } = data
                let checkCreate = await db.Notifycation.create({
                    senderId: userId,
                    receiverId: receiverId,
                    messageEn: messageEn,
                    messageVi: messageVi,
                    titleId: titleId,
                    productId: productId,
                    location: location,
                    time: moment().format(keyMap.FORMAT_TIME)
                })
                resolve(handleCheckCreate(checkCreate))
            } catch (error) {
                reject(error);
            }
        })
    }



    getNumberNotifycationByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let numberNotify = await db.Notifycation.count({ where: { receiverId: userId } })
                if (!numberNotify) {
                    resolve({
                        errCode: 1,
                        messageEN: "Get numberNotify failed",
                        messageVI: "Lấy số lượng thông báo thất bại",
                        data: numberNotify
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: numberNotify
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getNumberCartByUser = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data
                let numberNotify = await db.Cart.count({ where: { userId: userId, statusId: keyMap.TRONGGIO } })
                if (!numberNotify) {
                    resolve({
                        errCode: 1,
                        messageEN: "Get number cart failed",
                        messageVI: "Lấy số lượng giỏ hàng thất bại",
                        data: numberNotify
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: numberCart
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new userService();
