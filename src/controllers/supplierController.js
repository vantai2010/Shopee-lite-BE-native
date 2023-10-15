
const supplierService = require("../services/supplierService")

class supplierController {

    createNewProduct = async (req, res) => {
        try {
            let { name, image, price, description, categoryId, quantity, arrType } = req.body;

            // console.log("truoc ", arrType, typeof arrType);
            // const jsonString = req.files['arrType'][0].buffer.toString('utf-8');
            let arrTypeEncode = JSON.parse(arrType[0])
            // console.log(arrType, typeof arrType);
            if (!name || !image || !price || !description || !categoryId || !quantity) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            // console.log("file name", req.files)
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
            let { name, image, price, description, categoryId, quantity, arrType } = req.body;
            let { productId } = req.query
            let arrTypeEncode = JSON.parse(arrType[0])
            if (!productId || !name || !image || !price || !description || !categoryId || !quantity || !arrType) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.updateProductBySupplier({
                ...req.body,
                supplierId:
                    req.userId,
                ...req.query,
                arrType: arrTypeEncode,
                files: req.files
            })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    deleteProductBySupplier = async (req, res) => {
        try {
            let { productId } = req.query;

            if (!productId) {
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

    confirmPackingProductSuccess = async (req, res) => {
        try {
            let { cartId } = req.body;

            if (!cartId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }

            let response = await supplierService.confirmPackingProductSuccess({ ...req.body, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

}



module.exports = new supplierController()