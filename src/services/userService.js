const keyMap = require("../utils/constant/keyMap")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")

class userService {

    registerAccount = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { email, password, language } = data

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
                        await emailService.sendEmailRegister({ accountId: check.id, language })
                        resolve({
                            errCode: 0,
                            messageEN: "Registration successful",
                            messageVI: "Vui lòng kiểm tra email để xác thực"
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
                    let accountOfUser = await db.Account.findOne({ where: { id: accountId } })
                    accountOfUser.userId = checkCreate.id
                    let checkUpdateAccount = await accountOfUser.save()
                    if (checkUpdateAccount) {
                        resolve({
                            errCode: -1,
                            messageEN: "There was an error while updating information on the server",
                            messageVI: "Có lỗi trong quá trình cập nhật thông tin ở máy chủ"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "You have successfully registered an account!",
                            messageVI: "Bạn đã đăng ký tài khoản thành công !"
                        })
                    }
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
                    let passwordVerify = await argon2.verifyPassword(password, checkEmailExist.password)
                    if (!passwordVerify) {
                        resolve({
                            errCode: 1,
                            messageEN: "Password verification failed",
                            messageVI: "Mật khẩu không chính xác"
                        })
                    } else {
                        let token = jwt.sign({ userId: checkEmailExist.userId, roleId: checkEmailExist.roleId }, process.env.ACCESS_TOKEN_SECRET)
                        let user = await db.User.findOne({
                            where: { id: checkEmailExist.userId }
                        })
                        resolve({
                            errCode: 0,
                            messageEN: "Login successfully",
                            messageVI: "Đăng nhập thành công",
                            data: user,
                            token: token
                        })
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new userService();