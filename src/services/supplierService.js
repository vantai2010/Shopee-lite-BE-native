const keyMap = require("../utils/constant/keyMap")
const db = require("../models/index")
const argon2 = require("argon2")
const emailService = require("./emailService")
const jwt = require("jsonwebtoken")
const { handleCheckUpdate, handleCheckCreate, handleCheckDelete } = require("../utils/verifyORM/checkResult")
const { Op } = require("sequelize")

const handleUpdateProduct = async ({ checkUpdateProduct, checkDestroyProductType, arrType }) => {
    if (!checkUpdateProduct) {
        return {
            errCode: 2,
            messageEN: "Update product failed",
            messageVI: "Cập nhật thông tin sản phẩm thất bại"
        }
    } else if (!checkDestroyProductType) {
        return {
            errCode: 2,
            messageEN: "The product model update process encountered a problem",
            messageVI: "Quá trình cập nhật kiểu sản phẩm gặp trục trặc"
        }
    } else {
        let checkCreateProductType = await db.Product_Type.bulkCreate(arrType)
        if (!checkCreateProductType) {
            return {
                errCode: 3,
                messageEN: "Update product successfully",
                messageVI: "Cập nhật sản phẩm thành công"
            }
        }
    }
}

class supplierService {

    createNewProduct = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { name, image, price, description, categoryId, supplierId, quantity, arrType } = data
                let chekcExist = await db.Product.findOne({
                    where: { name: name, supplierId: supplierId }
                })

                if (chekcExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "The product already exists",
                        messageVI: "Sản phẩm đã tồn tại"
                    })
                } else if (!arrType) {
                    let checkCreate = await db.Product.create({
                        name: name,
                        image: image,
                        price: price,
                        description: description,
                        categoryId: categoryId,
                        supplierId: supplierId,
                        quantity: quantity,
                        bought: 0,
                        roomId: name + price + supplierId
                    })
                    resolve(handleCheckCreate(checkCreate))
                } else {
                    let checkCreateProduct = await db.Product.create({
                        name: name,
                        image: image,
                        price: price,
                        description: description,
                        categoryId: categoryId,
                        supplierId: supplierId,
                        quantity: quantity,
                        bought: 0,
                        roomId: name + price + supplierId
                    })
                    if (!checkCreateProduct) {
                        resolve({
                            errCode: 2,
                            messageEN: "Create a new product failed",
                            messageVI: "Tạo mới sản phẩm thất bại"
                        })
                    } else {
                        arrType = arrType.map(item => {
                            return {
                                supplierId: checkCreateProduct.id,
                                type: item.type,
                                size: item.size,
                                image: item.image
                            }
                        })
                        let checkCreate = await db.Product_Type.bulkCreate(arrType)
                        if (!checkCreate) {
                            resolve({
                                errCode: 3,
                                messageEN: "Create type product failed",
                                messageVI: "Tạo kiểu cho sản phẩm thất bại"
                            })
                        } else {
                            resolve({
                                errCode: 0,
                                messageEN: "Create a new product successfully",
                                messageVI: "Tạo mới sản phẩm thành công"
                            })
                        }
                    }
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
                    for (let i = 0; i < products.length; i++) {
                        products[i].image = products[i].image?.map(image => {
                            return new Buffer(image, 'base64').toString("binary");
                        })
                    }
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
                let { productId, name, image, price, description, categoryId, supplierId, quantity, arrType } = data
                if (arrType) {
                    arrType = arrType.map(item => {
                        return {
                            productId: productId,
                            type: item.type,
                            size: item.size,
                            image: item.image
                        }
                    })
                }
                let checkProductExists = await db.Product.findOne({
                    where: { id: productId }
                })
                let checkProductTypeExist = await db.Product_Type.findAll({
                    where: { productId: productId }
                })
                if (!checkProductExists || !checkProductTypeExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Product not found",
                        messageVI: "Không tìm thấy sản phẩm"
                    })
                } else if (checkProductExists.name !== name) {
                    let checkNameProduct = await db.Product.findOne({
                        where: { id: productId, name: name }
                    })
                    if (checkNameProduct) {
                        resolve({
                            errCode: 1,
                            messageEN: "Name Product is already in use",
                            messageVI: "Tên sản phẩm này đã tồn tại"
                        })
                    } else {
                        checkProductExists.name = name
                        checkProductExists.image = image
                        checkProductExists.price = price
                        checkProductExists.description = description
                        checkProductExists.categoryId = categoryId
                        checkProductExists.quantity = quantity
                        let checkUpdateProduct = await checkProductExists.save()
                        let checkDestroyProductType = await db.Product_Type.destroy({
                            where: { productId: productId }
                        })
                        let response = await handleUpdateProduct({ checkUpdateProduct, checkDestroyProductType, arrType })
                        resolve(response)
                    }
                }
                else if (checkProductExists.name === name) {
                    checkProductExists.name = name
                    checkProductExists.image = image
                    checkProductExists.price = price
                    checkProductExists.description = description
                    checkProductExists.categoryId = categoryId
                    checkProductExists.quantity = quantity
                    let checkUpdateProduct = await checkProductExists.save()
                    let checkDestroyProductType = await db.Product_Type.destroy({
                        where: { productId: productId }
                    })
                    let response = await handleUpdateProduct({ checkUpdateProduct, checkDestroyProductType, arrType })
                    resolve(response)
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
                resolve(handleCheckDelete(checkDelete))
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

    confirmPackingProductSuccess = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { cartId } = data
                let cartData = await db.Cart.findOne({
                    where: { id: cartId }
                })
                if (!cartData) {
                    resolve({
                        errCode: 1,
                        messageEN: "Cart not found",
                        messageVI: "Không tìm thấy giỏ hàng"
                    })
                } else {
                    if (cartData.statusId === keyMap.CHOLAYHANG_CHUATHANHTOAN) {
                        cartData.statusId = keyMap.DANGSHIP_CHUATHANHTOAN
                    }
                    if (cartData.statusId === keyMap.CHOLAYHANG_DATHANHTOAN) {
                        cartData.statusId = keyMap.DANGSHIP_DATHANHTOAN
                    }
                    let checkUpdate = await cartData.save()
                    resolve(handleCheckUpdate(checkUpdate))
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new supplierService();