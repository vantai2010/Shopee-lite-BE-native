const keyMap = require("../utils/constant/keyMap")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate, handleCheckCreate, handleCheckDelete } = require("../utils/verifyORM/checkResult")
const { Op } = require("sequelize")

class supplierService {


    createNewProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { name, image, price, description, categoryId, supplierId, quantity } = data
                let chekcExist = await db.Product.findOne({
                    where: { name: name, supplierId: supplierId }
                })

                if (chekcExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "The product already exists",
                        messageVI: "Sản phẩm đã tồn tại"
                    })
                } else {
                    let checkCreate = await db.Product.create({
                        name: name,
                        image: image,
                        price: price,
                        description: description,
                        categoryId: categoryId,
                        supplierId: supplierId,
                        quantity: quantity
                    })
                    handleCheckCreate(checkCreate)
                }


            } catch (error) {
                reject(error);
            }
        })
    }

    getProductBySupplierId = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId, searchName, pageIndex, pageSize } = data

                let optionsFind = {
                    supplierId: supplierId
                }
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
                    limit: limit,
                    offsey: offset
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

    updateProductBySupplier = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, name, image, price, description, categoryId, supplierId, quantity } = data
                let checkProductExists = await db.Product.findOne({
                    where: { id: productId }
                })
                if (!checkProductExists) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Không tìm thấy sản phẩm"
                    })
                } else {
                    checkProductExists.name = name
                    checkProductExists.image = image
                    checkProductExists.price = price
                    checkProductExists.description = description
                    checkProductExists.categoryId = categoryId
                    checkProductExists.quantity = quantity
                    let checkUpdate = await checkProductExists.save()
                    handleCheckUpdate(checkUpdate)
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    deleteProductBySupplier = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId, productId } = data
                let optionsFind = {}
                if (Array.isArray(supplierId)) {
                    optionsFind.id = {
                        [Op.in]: productId
                    }
                } else {
                    optionsFind.id = productId
                }

                let checkDelete = await db.Product.destroy({
                    where: optionsFind
                })
                handleCheckDelete(checkDelete)
            } catch (error) {
                reject(error);
            }
        })
    }

    getProductOnTransaction = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId, statusId, searchUserName, searchProductName, pageIndex, pageSize } = data

                let optionsFindUserName = {}
                let optionsFindProductName = {}

                if (optionsFindUserName) {
                    optionsFindUserName = {
                        [Op.or]: [
                            {
                                firstName: {
                                    [Op.iLike]: `%${searchUserName}%`
                                }
                            },
                            {
                                lastName: {
                                    [Op.iLike]: `%${searchUserName}%`
                                }
                            }
                        ]
                    }
                }

                if (optionsFindProductName) {
                    optionsFindProductName.name = {
                        [Op.iLike]: `%${searchProductName}%`
                    }
                }

                // let offset = 0;
                // let limit = pageSize || null;

                // if (pageIndex && pageSize) {
                //     offset = (pageIndex - 1) * pageSize;
                // }

                // let totalCount = await db.Cart.count({
                //     where: {
                //         supplierId: supplierId,
                //         statusId: statusId,
                //     }
                // });

                let products = await db.Cart.findAll({
                    where: {
                        supplierId: supplierId,
                        statusId: statusId,
                    },
                    include: [
                        {
                            model: db.Product,
                            as: "productCartData",
                            attributes: ["id", "name", "description", "image", "price"],
                            where: optionsFindProductName
                        },
                        {
                            model: db.User,
                            as: "userCartData",
                            attributes: ["id", "firstName", "lastName", "phoneNumber"],
                            where: optionsFindUserName
                        }
                    ],
                    // limit: limit,
                    // offsey: offset
                })
                if (products && totalCount) {
                    resolve({
                        errCode: 0,
                        messageEN: "Get products successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: products
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

    getHistoryTransaction = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId, productId, searchProductName, searchUserName, pageIndex, pageSize } = data

                let optionsFindByProductName = {}
                let optionsFindByUserName = {}

                let optionsFind = {
                    supplierId: supplierId,
                    productId: productId
                }

                if (searchProductName) {
                    optionsFindByProductName.name = {
                        [Op.iLike]: `%${searchName}%`
                    }
                }

                if (searchUserName) {
                    optionsFindByUserName = {
                        [Op.or]: [
                            {
                                firstName: {
                                    [Op.iLike]: `%${searchUserName}%`
                                }
                            },
                            {
                                lastName: {
                                    [Op.iLike]: `%${searchUserName}%`
                                }
                            }
                        ]
                    }
                }

                let offset = 0;
                let limit = pageSize || null;

                if (pageIndex && pageSize) {
                    offset = (pageIndex - 1) * pageSize;
                }
                let totalCount = await db.History.count({
                    where: optionsFind,
                    include: [
                        {
                            model: db.Product,
                            as: "productHistoryData",
                            where: optionsFindByProductName
                        },
                        {
                            model: db.User,
                            as: "userHistoryData",
                            where: optionsFindByUserName
                        }
                    ],
                });

                let histories = await db.History.findAll({
                    where: optionsFind,
                    include: [
                        {
                            model: db.Product,
                            as: "productHistoryData",
                            where: optionsFindByProductName
                        },
                        {
                            model: db.User,
                            as: "userHistoryData",
                            where: optionsFindByUserName
                        }
                    ],
                    limit: limit,
                    offsey: offset
                })
                if (histories && totalCount) {
                    resolve({
                        errCode: 0,
                        messageEN: "Get histories successfully",
                        messageVI: "Lấy thông tin lịch sử thành công",
                        data: {
                            histories: histories,
                            totalItems: totalCount,
                        }
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Get histories failed",
                        messageVI: "Lấy thông tin lịch sử thất bại",
                    })
                }

            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new supplierService();