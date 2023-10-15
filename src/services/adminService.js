const keyMap = require("../utils/constant/keyMap")
const Sequelize = require("sequelize")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate } = require("../utils/verifyORM/checkResult")
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
                    include: [
                        {
                            model: db.User,
                            as: "accountUserData"
                        }
                    ]
                })
                if (!getAccountByRolId) {
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
                        data: getAccountByRolId
                    })
                }

            } catch (error) {
                reject(error);
            }
        })
    }

}

module.exports = new adminService();