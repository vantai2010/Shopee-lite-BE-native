
const supplierService = require("../services/supplierService")

class supplierController {

    createNewProduct = async (req, res) => {
        try {
            let { name, image, price, description, categoryId, quantity } = req.body;

            if (!name || !image || !price || !description || !categoryId || !quantity) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.createNewProduct({ ...req.body, supplierId: req.userId })
            return res.status(200).json(response)
        } catch (error) {
            return res.status(400).json({
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
                errCode: -1,
                messageEN: 'ERROR from to server ',
                messageVI: "Có lỗi từ phía server "
            })
        }
    }

    updateProductBySupplier = async (req, res) => {
        try {
            let { name, image, price, description, categoryId, quantity } = req.body;
            let { productId } = req.query
            if (!productId || !name || !image || !price || !description || !categoryId || !quantity) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await supplierService.updateProductBySupplier({ ...req.body, supplierId: req.userId, ...req.query })
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
                messageVI: "Có lỗi từ phía server "
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

}



module.exports = new supplierController()