const keyMap = require("../utils/constant/keyMap")
const Sequelize = require("sequelize")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")
const moment = require("moment")
const { handleCheckUpdate, handleCheckCreate } = require("../utils/verifyORM/checkResult")
const handleDeleteImageFIle = require("../utils/handleDeleteImage")
require('dotenv').config()

class adminService {

    getProductByAdmin = (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                let { searchName, pageIndex, pageSize } = data

                let optionsFind = {}
                if (searchName) {
                    optionsFind.name = {
                        [Op.iLike]: `%${searchName}%`
                    }
                }

                let offset = 0;
                let limit = pageSize || null;

                if (pageIndex && pageSize) {
                    offset = (pageIndex - 1) * pageSize;
                }
                let totalCount = await db.Product.count({
                    where: optionsFind,
                });

                let products = await db.Product.findAll({
                    where: optionsFind,
                    include: [
                        {
                            model: db.Product_Type,
                            as: "productTypeData"
                        }
                    ],
                    limit: limit,
                    offsey: offset,
                    raw: true
                })
                if (products && totalCount) {
                    resolve({
                        errCode: 0,
                        messageEN: "Get products successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: {
                            products: products,
                            totalItems: totalCount,
                        }
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Get products failed",
                        messageVI: "Lấy sản phẩm thất bại",
                    })
                }


            } catch (error) {
                reject(error);
            }
        })
    }

    getAllUsers = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { roleId } = data

                let getAccountByRolId = await db.Account.findAll({
                    where: { roleId: roleId },
                })
                if (!getAccountByRolId) {
                    resolve({
                        errCode: 1,
                        messageEN: "Retrieve information failed",
                        messageVI: "Lấy thông tin thất bại"
                    })
                } else {
                    let listUsers = await db.User.findAll({
                        where: {
                            accountId: {
                                [Op.in]: getAccountByRolId.map(item => item.id)
                            }
                        },
                        include: [
                            {
                                model: db.Account,
                                as: "accountUserData",
                                attributes: ["email"]
                            }
                        ]
                    })
                    let numberADMIN = await db.Account.count({
                        where: { roleId: keyMap.ADMIN }
                    })
                    let numberSUPPLIER = await db.Account.count({
                        where: { roleId: keyMap.SUPPLIER }
                    })
                    let numberUSER = await db.Account.count({
                        where: { roleId: keyMap.USER }
                    })
                    if (!listUsers) {
                        resolve({
                            errCode: 1,
                            messageEN: "Retrieve information failed",
                            messageVI: "Lấy thông tin thất bại"
                        })
                    } else {
                        resolve({
                            errCode: 0,
                            messageEN: "Retrieve information successfully",
                            messageVI: "Lấy thông tin thành công",
                            data: {
                                listUsers,
                                numberCount: {
                                    ADMIN: numberADMIN,
                                    SUPPLIER: numberSUPPLIER,
                                    USER: numberUSER
                                }
                            }
                        })
                    }
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    updateUserByAdmin = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, roleId } = data

                let userData = await db.User.findOne({
                    where: { id: userId }
                })
                if (!userData) {
                    resolve({
                        errCode: 1,
                        messageEN: "User not found",
                        messageVI: "Không tìm thấy người dùng này"
                    })
                } else {
                    let checkUpdate = await db.Account.update({ roleId: roleId }, { where: { id: userData.accountId } })
                    resolve(handleCheckUpdate(checkUpdate))
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    deleteUserByAdmin = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId } = data

                let userData = await db.User.findOne({
                    where: { id: userId }
                })
                if (!userData) {
                    resolve({
                        errCode: 1,
                        messageEN: "User not found",
                        messageVI: "Không tìm thấy người dùng này"
                    })
                } else {
                    let checkDelete = await db.Account.destroy({ where: { id: userData.accountId } })
                    let checkUpdate = await db.User.destroy({ where: { id: userId } })
                    let productOfSupplier = await db.Product.findAll({
                        where: { supplierId: userId }
                    })
                    let checkDeleteProduct = await db.Product.destroy({
                        where: { supplierId: userId }
                    })
                    let checkDeleteProductType = await db.Product_Type.destroy({
                        where: {
                            productId: {
                                [Op.in]: productOfSupplier.map(item => item.id)
                            }
                        }
                    })
                    handleDeleteImageFIle(checkDeleteProduct.image)
                    resolve({
                        errCode: 0,
                        messageEN: "Delete information successfully",
                        messageVI: "Xóa thông tin thành công"
                    })
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    createNewUserByAdmin = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { email, password, firstName, lastName, address, phoneNumber, genderId, roleId, image } = data
                let passwordHashed = await argon2.hash(password)
                let checkEmailExists = await db.Account.findOne({ where: { email: email } })
                if (checkEmailExists) {
                    resolve({
                        errCode: 1,
                        messageEN: "Email already exists",
                        messageVI: "Email này đã tồn tại"
                    })
                } else {
                    let checkCreateAccount = await db.Account.create({
                        email: email,
                        password: passwordHashed,
                        roleId: roleId
                    })
                    if (!checkCreateAccount) {
                        resolve({
                            errCode: 1,
                            messageEN: "Create accound failed",
                            messageVI: "Tạo tài khoản mới thất bại"
                        })
                    } else {
                        let checkCreateUser = await db.User.create({
                            accountId: checkCreateAccount.id,
                            firstName: firstName,
                            lastName: lastName,
                            address: address,
                            phoneNumber: phoneNumber,
                            genderId: genderId,
                            image: image
                        })
                        if (!checkCreateUser) {
                            resolve({
                                errCode: 1,
                                messageEN: "Create User failed",
                                messageVI: "Tạo mới người dùng thất bại"
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                messageEN: "Create User succeeded",
                                messageVI: "Tạo mới người dùng thành công"
                            })
                        }
                    }
                }

            } catch (error) {
                reject(error);
            }
        })
    }

    createNewNotitySocket = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { receiverId, messageEn, messageVi, titleId, productId, location, senderId } = data
                let checkCreate = await db.Notifycation.create({
                    senderId: senderId,
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

    addNewVoucherByAdmin = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, type, discount, conditionsPrice, timeEnd } = data

            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new adminService();