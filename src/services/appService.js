const keyMap = require("../utils/constant/keyMap")
const Sequelize = require("sequelize")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate } = require("../utils/verifyORM/checkResult")
require('dotenv').config()

class appService {

    getProduct = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let products = await db.Product.findAll({
                    attributes: ['id', 'name', "image", 'bought', 'price']
                })

                if (!products) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Không tìm thấy sản phẩm"
                    })
                } else {

                    resolve({
                        errCode: 0,
                        messageEN: "Get Product successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: products
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getProductDetail = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId } = data
                let products = await db.Product.findOne({
                    where: { id: productId },
                    attributes: ['id', 'name', "image", 'bought', 'price'],
                    include: [
                        {
                            model: db.Review,
                            as: "productReviewData",
                            attributes: ["rating", "comment"],
                            include: [
                                {
                                    model: db.User,
                                    as: "userReviewData",
                                    attributes: ["id", "image", "firstName", "lastName"]
                                }
                            ]
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeData",
                            attributes: ["id", "type", "size", "quantity"]
                        }
                    ]
                })

                if (!products) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Không tìm thấy sản phẩm"
                    })
                } else {

                    resolve({
                        errCode: 0,
                        messageEN: "Get Product successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: products
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new appService();
// nỏ bị chi mô 