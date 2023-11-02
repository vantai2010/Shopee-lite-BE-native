const keyMap = require("../utils/constant/keyMap")
const Sequelize = require("sequelize")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate } = require("../utils/verifyORM/checkResult")
require('dotenv').config()

class appService {
    splitDecimal = (number) => {
        if (!number) return
        const integerPart = Math.floor(number);
        const fractionalPart = number - integerPart;
        return { integer: integerPart, fractional: fractionalPart };
    }

    getProduct = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let products = await db.Product.findAll({
                    attributes: ['id', 'name', 'image', 'bought', 'price'],
                    include: [
                        {
                            model: db.Review,
                            as: "productReviewData",
                            attributes: ["rating"],

                        },
                    ],
                });



                products = products.map(item => {
                    let totalStar = item.productReviewData.reduce((result, rating) => result + rating.rating, 0)
                    let star = totalStar / item.productReviewData.length
                    star = Math.round(star * 100) / 100

                    let arr = []
                    const { integer, fractional } = this.splitDecimal(star);
                    let integerRating = integer
                    let addFractional = false
                    for (let i = 0; i < 5; i++) {
                        if (integerRating > 0) {
                            arr.push(1)
                        } else if (integerRating === 0 && addFractional === false) {
                            arr.push(fractional)
                            addFractional = true
                        } else {
                            arr.push(0)
                        }
                        integerRating = integerRating - 1
                    }

                    return {
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        bought: item.bought,
                        price: item.price,
                        star: arr.length > 0 ? arr : [0, 0, 0, 0, 0]
                    }
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
                        data: products,
                        // star: avgStar
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
                    attributes: ['id', 'name', "image", 'bought', 'price', "description", "supplierId"],
                    include: [
                        {
                            model: db.Review,
                            as: "productReviewData",
                            attributes: ["id", "rating", "comment", "time"],
                            include: [
                                {
                                    model: db.User,
                                    as: "userReviewData",
                                    attributes: ["id", "image", "firstName", "lastName"]
                                },
                                {
                                    model: db.Product_Type,
                                    as: "productTypeReviewData",
                                    attributes: ["type", "size"]
                                }
                            ],
                            limit: 3
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeData",
                            attributes: ["id", "type", "size", "quantity"]
                        },
                        {
                            model: db.User,
                            as: "productSupplierData",
                            attributes: ["id", "firstName", "lastName", "address", "image"]
                        }
                    ],

                })

                if (!products) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Không tìm thấy sản phẩm"
                    })
                } else {
                    let star = await db.Review.findOne({
                        attributes: [
                            [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],
                            [Sequelize.fn('COUNT', Sequelize.col('rating')), 'totalReviews'],
                        ],
                        where: {
                            productId: productId,
                        },
                        raw: true
                    });
                    star = { ...star, averageRating: Math.round(star.averageRating * 100) / 100 }
                    resolve({
                        errCode: 0,
                        messageEN: "Get Product successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: products,
                        star: star
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getInforShop = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId } = data
                let supplierData = await db.User.findOne({
                    where: { id: supplierId },
                    attributes: ["id", "firstName", "lastName", "address", "phoneNumber", "image"],
                    raw: true
                })
                let productOfSupplier = await db.Product.findAll({
                    where: { supplierId: supplierId },
                    include: [
                        {
                            model: db.Review,
                            as: "productReviewData",
                            attributes: ["rating"],
                            // attributes: [[Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating'],],
                            // raw: true
                        }
                    ],
                    // raw: true
                })
                if (!productOfSupplier || !supplierData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    let followingNumber = await db.Interact.findAll({ where: { followedId: supplierId } })

                    productOfSupplier = productOfSupplier.map(item => {
                        let totalStar = item.productReviewData.reduce((result, rating) => result + rating.rating, 0)
                        let star = totalStar / item.productReviewData.length
                        star = Math.round(star * 100) / 100

                        let arr = []
                        const { integer, fractional } = this.splitDecimal(star);
                        // console.log(fractional)
                        let integerRating = integer
                        let addFractional = false
                        for (let i = 0; i < 5; i++) {
                            if (integerRating > 0) {
                                arr.push(1)
                            } else if (integerRating === 0 && addFractional === false) {
                                arr.push(fractional)
                                addFractional = true
                            } else {
                                arr.push(0)
                            }
                            integerRating = integerRating - 1
                        }
                        return {
                            id: item.id,
                            name: item.name,
                            image: item.image,
                            price: item.price,
                            bought: item.bought,
                            star: arr.length > 0 ? arr : [0, 0, 0, 0, 0],
                            numberStar: star
                        }
                    })

                    let totalStarOfShop = productOfSupplier.reduce((result, item) => result + item.numberStar, 0)
                    let starShop = totalStarOfShop / productOfSupplier.length
                    starShop = Math.round(starShop * 100) / 100
                    resolve({
                        errCode: 0,
                        messageEN: "Get infor shop successfully",
                        messageVI: "Lấy thông tin cửa hàng thành công",
                        data: { ...supplierData, listProducts: productOfSupplier, followingNumber, starShop: starShop }
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getListReviewOfProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId } = data
                let reviews = await db.Review.findAll({
                    where: {
                        productId: productId
                    },
                    include: [
                        {
                            model: db.User,
                            as: "userReviewData",
                            attributes: ["id", "image", "firstName", "lastName"]
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeReviewData",
                            attributes: ["type", "size"]
                        }
                    ]
                })
                if (!reviews) {
                    resolve({
                        errCode: 1,
                        messageEN: "Get List review failed",
                        messageVI: "Lấy danh sách nhận xét thất bại"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Get List review succeeded",
                        messageVI: "Lấy danh sách nhận xét thành công",
                        data: reviews
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