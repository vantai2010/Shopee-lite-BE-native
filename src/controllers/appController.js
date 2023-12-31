
const appService = require("../services/appService")

class appController {

    getProduct = async (req, res) => {
        try {

            let response = await appService.getProduct()
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

    getProductDetail = async (req, res) => {
        try {
            let { productId } = req.query
            if (!productId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await appService.getProductDetail(req.query)
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

    getInforShop = async (req, res) => {
        try {
            let { supplierId } = req.query
            if (!supplierId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await appService.getInforShop(req.query)
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

    getListReviewOfProduct = async (req, res) => {
        try {
            let { productId } = req.query
            if (!productId) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: "Missing information in request ",
                    messageVI: "Thiếu thông tin chuyền lên "
                })
            }
            let response = await appService.getListReviewOfProduct(req.query)
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



module.exports = new appController()