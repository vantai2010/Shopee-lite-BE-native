const keyMap = require("../utils/constant/keyMap")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate, handleCheckCreate, handleCheckDelete } = require("../utils/verifyORM/checkResult")
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
                            where: { accountId: checkEmailExist.id }
                        })
                        if (!user) {
                            resolve({
                                errCode: 1,
                                messageEN: "Information user not found",
                                messageVI: "Không tìm thấy thông tin người dùng"
                            })
                        } else {
                            let token = jwt.sign({ userId: user.id, roleId: checkEmailExist.roleId }, process.env.ACCESS_TOKEN_SECRET)
                            resolve({
                                errCode: 0,
                                messageEN: "Login successfully",
                                messageVI: "Đăng nhập thành công",
                                data: { ...user, roleId: checkEmailExist.roleId, email: email },
                                token: token
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
                    where: { id: data.userId }
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
                    resolve({
                        errCode: 0,
                        messageEN: "Login successfully",
                        messageVI: "Đăng nhập thành công",
                        data: { ...userData, roleId: data.roleId, email: userAccountData.email }
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
                    where: { userId: userId },
                    include: {
                        model: db.Product,
                        attributes: ["name"]
                    }
                })
                if (!dataCart) {
                    resolve({
                        errCode: 1,
                        messageEN: "Retrieving cart information failed",
                        messsageVI: "Lấy thông tin giỏ hàng thất bại"
                    })
                } else {
                    let imageProductType = await db.Product_type.findOne({
                        where: { productId: dataCart.productId, type: dataCart.productType },
                        attributes: ["image"]
                    })
                    if (!imageProductType) {
                        resolve({
                            errCode: 1,
                            messageEN: "Retrieving image information failed",
                            messageVI: "Lấy thông tin hình ảnh thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Retrieve shopping cart information successfully",
                            messageVI: "Lấy thông tin giỏ hàng thành công",
                            data: { ...dataCart, ...imageProductType }
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }


    updateQuantityCart = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId, quantity } = data
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
                let { productId, productType, quantity, userId, supplierId, totalPaid, time } = data
                let checkCartUser = await db.User.findAll({
                    where: { id: userId }
                })
                if (checkCartUser.length > 10) {
                    resolve({
                        errCode: 1,
                        messageEN: "You can only have a maximum of 10 items in your cart",
                        messageVI: "Bạn chỉ được tối đa 10 mặt hàng trong giỏ"
                    })
                } else {
                    let checkCreate = await db.Cart.create({
                        productId: productId,
                        productType: productType,
                        quantity: quantity,
                        userId: userId,
                        supplierId: supplierId,
                        totalPaid: totalPaid,
                        time: time,
                        timeStart: time
                    })
                    resolve(handleCheckCreate(checkCreate))
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
                    optionsFind.id = {
                        [Op.in]: productId
                    }
                } else {
                    optionsFind.id = productId
                }

                let checkExist = await db.Cart.findAll({
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
                            totalPaid: checkCart.totalPaid,
                            startTime: checkCart.startTime,
                            endTime: checkCart.time
                        })
                        let checkCreateReview = await db.Review.create({
                            userId: checkCart.userId,
                            productId: checkCart.productId,
                            productType: checkCart.productType,
                        })
                        if (!checkCreate) {
                            resolve({
                                errCode: 1,
                                messageEN: "Update transaction to failure history",
                                messageVI: "Cập nhật giao dịch vào lịch sử thất bại"
                            })
                        } else if (!checkCreateReview) {
                            resolve({
                                errCode: 1,
                                messageEN: "Update failed assessment information",
                                messageVI: "Cập nhật thông tin đánh giá thất bại"
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                messageEN: "Confirm successful transaction",
                                messageVI: "Xác nhận giao dịch thành công",
                                reviewId: checkCreateReview.id
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

}

module.exports = new userService();