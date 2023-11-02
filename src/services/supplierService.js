
const db = require("../models/index")
const { handleCheckUpdate, handleCheckCreate, handleCheckDelete } = require("../utils/verifyORM/checkResult")
const { Op, Sequelize } = require("sequelize")
const handleDeleteImageFIle = require("../utils/handleDeleteImage")
const keyMap = require("../utils/constant/keyMap")
const moment = require("moment")

const handleUpdateProduct = async ({ checkUpdateProduct, checkDestroyProductType, arrType }) => {
    // console.log("arrType", arrType)
    if (!checkUpdateProduct) {
        return {
            errCode: 2,
            messageEN: "Update product failed",
            messageVI: "Cập nhật thông tin sản phẩm thất bại"
        }
        // } else if (!checkDestroyProductType && arrType.length > 0) {
        //     return {
        //         errCode: 2,
        //         messageEN: "The product model update process encountered a problem",
        //         messageVI: "Quá trình cập nhật kiểu sản phẩm gặp trục trặc"
        //     }
        // } 
    } else {
        let checkCreateProductType = await db.Product_Type.bulkCreate(arrType)
        if (!checkCreateProductType) {
            return {
                errCode: 3,
                messageEN: "Update product failure",
                messageVI: "Cập nhật sản phẩm thất bại"
            }
        } else {
            return {
                errCode: 0,
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
                let { name, price, description, categoryId, supplierId, quantity, arrType, files } = data
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
                        image: files.map(file => file.filename),
                        price: price,
                        description: description,
                        categoryId: categoryId,
                        supplierId: supplierId,
                        quantity: quantity,
                        bought: 0,
                    })
                    resolve(handleCheckCreate(checkCreate))
                } else {
                    let checkCreateProduct = await db.Product.create({
                        name: name,
                        image: files.map(file => file.filename),
                        price: price,
                        description: description,
                        categoryId: categoryId,
                        supplierId: supplierId,
                        quantity: quantity,
                        bought: 0,
                    })
                    if (!checkCreateProduct) {
                        resolve({
                            errCode: 2,
                            messageEN: "Create a new product failed",
                            messageVI: "Tạo mới sản phẩm thất bại"
                        })
                    } else {
                        console.log("check sau :", arrType)
                        arrType = arrType.map(item => {
                            return {
                                productId: checkCreateProduct?.id,
                                type: item?.type,
                                size: item?.size,
                                quantity: item?.quantity
                            }
                        })
                        console.log(arrType)
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
                    raw: true,
                    nest: true
                })
                if (products && totalCount) {

                    let arrProducts = []
                    products.forEach(product => {
                        if (!arrProducts.some(item => item.id === product.id)) {
                            arrProducts.push({
                                id: product.id,
                                name: product.name,
                                image: product.image,
                                price: product.price,
                                supplierId: product.supplier,
                                description: product.description,
                                categoryId: product.categoryId,
                                quantity: product.quantity,
                                bought: product.bought,
                                productTypeData: []
                            })
                        }
                        arrProducts.map(item => {
                            if (item.id === product.id) {
                                if (!product.productTypeData.id) {
                                    return {
                                        ...item,
                                        productTypeData: []
                                    }
                                } else {
                                    return {
                                        ...item,
                                        productTypeData: item.productTypeData.push(product.productTypeData)
                                    }
                                }
                            } else {
                                return item
                            }
                        })
                    })
                    resolve({
                        errCode: 0,
                        messageEN: "Get products successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: {
                            products: arrProducts,
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
                let { productId, name, image, price, description, categoryId, supplierId, quantity, arrType, files, oldImage } = data
                if (arrType) {
                    arrType = arrType.map(item => {
                        return {
                            productId: productId,
                            type: item.type,
                            size: item.size,
                            quantity: item.quantity
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
                        const arrImageDeleted = oldImage.filter(item => !image.includes(item))
                        handleDeleteImageFIle(arrImageDeleted)
                        checkProductExists.name = name
                        checkProductExists.image = files?.map(file => file.filename).concat(image)
                        checkProductExists.price = price
                        checkProductExists.description = description
                        checkProductExists.categoryId = categoryId
                        checkProductExists.quantity = quantity
                        let checkUpdateProduct = await checkProductExists.save()
                        let checkDestroyProductType = await db.Product_Type.destroy({
                            where: arrType.length > 0 ? { productId: productId } : {}
                        })
                        let response = await handleUpdateProduct({ checkUpdateProduct, checkDestroyProductType, arrType })
                        resolve(response)
                    }
                }
                else if (checkProductExists.name === name) {
                    const arrImageDeleted = oldImage.filter(item => !image.includes(item))
                    handleDeleteImageFIle(arrImageDeleted)
                    checkProductExists.name = name
                    checkProductExists.image = files?.map(file => file.filename).concat(image)
                    checkProductExists.price = price
                    checkProductExists.description = description
                    checkProductExists.categoryId = categoryId
                    checkProductExists.quantity = quantity
                    let checkUpdateProduct = await checkProductExists.save()
                    let checkDestroyProductType = await db.Product_Type.destroy({
                        where: arrType.length > 0 ? { productId: productId } : {}
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
                let { supplierId, productId, imageProduct } = data
                let optionsFind = {}
                if (Array.isArray(supplierId)) {
                    optionsFind.id = {
                        [Op.in]: productId
                    }
                } else {
                    optionsFind.id = productId
                }
                console.log(imageProduct)
                handleDeleteImageFIle(imageProduct)
                let checkDelete = await db.Product.destroy({
                    where: optionsFind
                })
                if (!checkDelete) {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete product failed",
                        messageVI: "Xóa sản phẩm thành công"
                    })
                } else {
                    let checkDeleteProductType = await db.Product_Type.destroy({
                        where: { productId: productId }
                    })

                    resolve(handleCheckDelete(checkDeleteProductType))
                }
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
                            attributes: ["id", "name", "image", "price"],
                            // where: optionsFindProductName
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeCartData",
                            attributes: ["id", "type", "size", "quantity"],
                            // where: optionsFindProductName
                        },
                        {
                            model: db.User,
                            as: "userCartData",
                            attributes: ["id", "firstName", "lastName", "phoneNumber", "address"],
                            // where: optionsFindUserName
                        }
                    ],
                    // limit: limit,
                    // offsey: offset,
                    // raw: true
                })
                // console.log(products)
                if (products) {
                    let transOfStatusCHOLAYHANG_DATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.CHOLAYHANG_DATHANHTOAN }
                    })
                    let transOfStatusCHOLAYHANG_CHUATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.CHOLAYHANG_CHUATHANHTOAN }
                    })
                    let transOfStatusDANGSHIP_DATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.DANGSHIP_DATHANHTOAN }
                    })
                    let transOfStatusDANGSHIP_CHUATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.DANGSHIP_CHUATHANHTOAN }
                    })
                    let transOfStatusXACNHAN_CHUATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.CHOXACNHAN_CHUATHANHTOAN }
                    })
                    let transOfStatusXACNHAN_DATHANHTOAN = await db.Cart.count({
                        where: { supplierId: supplierId, statusId: keyMap.CHOXACNHAN_DATHANHTOAN }
                    })

                    resolve({
                        errCode: 0,
                        messageEN: "Get products successfully",
                        messageVI: "Lấy sản phẩm thành công",
                        data: {
                            products: products,
                            transCount: {
                                CHOLAYHANG_DATHANHTOAN: transOfStatusCHOLAYHANG_DATHANHTOAN,
                                CHOLAYHANG_CHUATHANHTOAN: transOfStatusCHOLAYHANG_CHUATHANHTOAN,
                                DANGSHIP_DATHANHTOAN: transOfStatusDANGSHIP_DATHANHTOAN,
                                DANGSHIP_CHUATHANHTOAN: transOfStatusDANGSHIP_CHUATHANHTOAN,
                                CHOXACNHAN_CHUATHANHTOAN: transOfStatusXACNHAN_CHUATHANHTOAN,
                                CHOXACNHAN_DATHANHTOAN: transOfStatusXACNHAN_DATHANHTOAN,
                            }
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

    confirmTransactionSuccess = (data) => {
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
                    let checkNumberProduct = await db.Product.findOne({
                        where: { id: cartData.productId }
                    })
                    let checkNumberProductType = await db.Product_Type.findOne({
                        where: { id: cartData.productTypeId }
                    })
                    if (checkNumberProduct.quantity < cartData.quantity || checkNumberProductType.quantity < cartData.quantity) {
                        resolve({
                            errCode: 1,
                            messageEN: "the number is out of range",
                            messageVI: "Số lượng mặt hàng không đủ"
                        })
                    } else {
                        if (cartData.statusId === keyMap.CHOXACNHAN_CHUATHANHTOAN) {
                            cartData.statusId = keyMap.CHOLAYHANG_CHUATHANHTOAN
                        } else if (cartData.statusId === keyMap.CHOXACNHAN_DATHANHTOAN) {
                            cartData.statusId = keyMap.CHOLAYHANG_DATHANHTOAN
                        } else if (cartData.statusId === keyMap.CHOLAYHANG_CHUATHANHTOAN) {
                            cartData.statusId = keyMap.DANGSHIP_CHUATHANHTOAN
                            await db.Product.update({ quantity: Sequelize.literal(`quantity - ${cartData.quantity}`), bought: Sequelize.literal(`bought + ${cartData.quantity}`) }, { where: { id: cartData.productId } })
                            await db.Product_Type.update({ quantity: Sequelize.literal(`quantity - ${cartData.quantity}`) }, { where: { id: cartData.productTypeId } })
                        } else if (cartData.statusId === keyMap.CHOLAYHANG_DATHANHTOAN) {
                            cartData.statusId = keyMap.DANGSHIP_DATHANHTOAN
                            await db.Product.update({ quantity: Sequelize.literal(`quantity - ${cartData.quantity}`), bought: Sequelize.literal(`bought + ${cartData.quantity}`) }, { where: { id: cartData.productId } })
                            await db.Product_Type.update({ quantity: Sequelize.literal(`quantity - ${cartData.quantity}`) }, { where: { id: cartData.productTypeId } })
                        }
                        cartData.time = moment().format(keyMap.FORMAT_TIME)
                        let checkUpdate = await cartData.save()
                        resolve(handleCheckUpdate(checkUpdate))
                    }
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    getHistoryBySupplier = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { supplierId, timeType, start, end } = data
                let startTime, endTime
                let today = moment()
                const dateFormat = 'YYYY-MM-DD HH:mm:ss.SSS Z';
                if (timeType === "DAY") {
                    startTime = today.startOf('day').format(dateFormat)
                    endTime = today.endOf('day').format(dateFormat)
                } else if (timeType === "WEEK") {
                    startTime = today.startOf('week').format(dateFormat)
                    endTime = today.endOf('week').format(dateFormat)
                } else if (timeType === "MONTH") {
                    startTime = today.startOf('month').format(dateFormat)
                    endTime = today.endOf('month').format(dateFormat)
                } else if (timeType === "DURING") {
                    startTime = moment(start).format(dateFormat);
                    endTime = moment(end).format(dateFormat)
                }
                // console.log(startTime, endTime, timeType)
                let histories = await db.History.findAll({
                    where: {
                        supplierId: supplierId,
                        createdAt: {
                            [Op.between]: [startTime, endTime] // Khoảng thời gian trong ngày hiện tại
                        }
                    },
                    include: [
                        {
                            model: db.Product,
                            as: "productHistoryData"
                        },
                        {
                            model: db.Product_Type,
                            as: "productTypeHistoryData"
                        },
                        {
                            model: db.User,
                            as: "userHistoryData"
                        }
                    ]
                })
                if (!histories) {
                    resolve({
                        errCode: 1,
                        messageEN: "Information not found",
                        messageVI: "Không tìm thấy thông tin"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageVI: "Lấy thông tin thành công",
                        messageEN: "Get information success",
                        data: histories
                    })
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    addNewVoucherForProductBySupplier = (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, discount, conditionsPrice, timeEnd } = data
                let checkExists = await db.Promotion.findOne({
                    where: { productId: productId, discount: discount, conditionsPrice: conditionsPrice }
                })
                if (checkExists) {
                    resolve({
                        errCode: 1,
                        messageEN: "Voucher is already exists",
                        messageVI: "Voucher này đã tồn tại"
                    })
                } else {
                    let checkCreate = await db.Promotion.create({
                        productId: productId,
                        discount: discount,
                        conditionsPrice: conditionsPrice,
                        type: keyMap.VOUCHERSHOP,
                        timeEnd: moment(timeEnd).format(keyMap.FORMAT_TIME)
                    })
                    resolve(handleCheckCreate(checkCreate))
                }
            } catch (error) {
                reject(error);
            }
        })
    }
}

module.exports = new supplierService();