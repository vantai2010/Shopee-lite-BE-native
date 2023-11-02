const handleDuplicate = require("../utils/handleDuplicate")
const supplierService = require("../services/supplierService")

class supplierController {

    createNewProduct = async (req, res) => {
        try {
            let { name, price, description, categoryId, quantity, arrType } = req.body;
            if (!name || !price || !description || !categoryId || !quantity) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let arrTypeEncode = JSON.parse(arrType)
            let response = await supplierService.createNewProduct({ ...req.body, supplierId: req.userId, files: req.files, arrType: arrTypeEncode })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getProductBySupplierId = async (req, res) => {
        try {
            let response = await supplierService.getProductBySupplierId({ ...req.query, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    updateProductBySupplier = async (req, res) => {
        try {

            let { name, price, description, categoryId, quantity, arrType, oldImage } = req.body;
            let { productId } = req.query
            if (!productId || !name || !price || !description || !categoryId || !quantity || !arrType || !oldImage) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let arrTypeEncode = JSON.parse(arrType)
            let response = await supplierService.updateProductBySupplier({
                ...req.body,
                ...req.query,
                // image: handleDuplicate(image),
                // oldImage: handleDuplicate(oldImage),
                supplierId: req.userId,
                arrType: arrTypeEncode,
                files: req.files
            })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    deleteProductBySupplier = async (req, res) => {
        try {
            let { productId, imageProduct } = req.query;
            if (!productId || !imageProduct) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.deleteProductBySupplier({ ...req.query, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server ",
                err: error.message
            })
        }
    }

    getProductOnTransaction = async (req, res) => {
        try {
            let { statusId } = req.query;
            if (!statusId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.getProductOnTransaction({ ...req.query, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getHistoryTransaction = async (req, res) => {
        try {
            let { productId } = req.query;

            if (!productId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await supplierService.getHistoryTransaction({ ...req.query, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    confirmTransactionSuccess = async (req, res) => {
        try {
            let { cartId } = req.body;

            if (!cartId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await supplierService.confirmTransactionSuccess({ ...req.body, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    getHistoryBySupplier = async (req, res) => {
        try {
            let { timeType, start, end } = req.query;
            if (!timeType) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            if (timeType === "DURING" && (!start || !end)) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.getHistoryBySupplier({ ...req.query, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    addNewVoucherForProductBySupplier = async (req, res) => {
        try {
            let { productId, discount, conditionsPrice, timeEnd } = req.body;
            if (!productId || !discount || !timeEnd || !conditionsPrice) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.addNewVoucherForProductBySupplier({ ...req.body, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                err: error.message,
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }


}



module.exports = new supplierController()