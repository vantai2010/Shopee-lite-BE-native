const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')
const checkSupplier = require('../middleware/checkSupplier')
const supplierController = require('../controllers/supplierController')
const appController = require('../controllers/appController')
const upload = require("../middleware/handleSaveImage")

router.post("/register", userController.registerAccount)
router.post("/register-information", upload.array("image"), userController.registerInformation)
router.post("/login", userController.loginAccount)
router.post("/login-token", verifyToken, userController.loginAccountWithToken)
router.post("/update-information", verifyToken, userController.updateInformation)
router.post("/update-bank-for-user", verifyToken, userController.updateBankForUser)
router.put("/add-money", verifyToken, userController.addMoney)

router.get("/get-all-cart", verifyToken, userController.getAllCart)
router.put("/update-quantity-cart", verifyToken, userController.updateQuantityCart)
router.post("/push-product-to-cart", verifyToken, userController.pushProductToCart)
router.delete("/delete-product-from-cart", verifyToken, userController.deleteProductFromCart)
router.post("/confirm-received-product", verifyToken, userController.confirmReceivedProduct)
router.put("/review-product", verifyToken, userController.reviewProduct)


router.post("/create-product-by-supplier", checkSupplier, upload.array("image"), supplierController.createNewProduct)
router.get("/get-product-by-supplierId", checkSupplier, supplierController.getProductBySupplierId)
router.get("/get-product-on-transaction", checkSupplier, supplierController.getProductOnTransaction)
router.get("/get-history-transaction", checkSupplier, supplierController.getHistoryTransaction)
router.put("/update-product-by-supplier", checkSupplier, upload.array("image"), supplierController.updateProductBySupplier)
router.delete("/delete-product-by-supplier", checkSupplier, supplierController.deleteProductBySupplier)
router.put("/confirm-packing-product-success", checkSupplier, supplierController.confirmPackingProductSuccess)

router.get("/get-product", appController.getProduct)
router.get("/get-product-detail", appController.getProductDetail)

router.get("/get-product-by-admin", checkAdmin, adminController.getProductByAdmin)
router.get("/get-all-users", checkAdmin, adminController.getAllUsers)



router.post("/r", (req, res) => {
    let formidable = require("formidable")

    var form = new formidable.IncomingForm()
    form.uploadDir = "./uploads"
    form.keepExtensions = true
    // form.maxFieldsSize = 10 * 1024 * 1024
    form.multiple = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json({
                result: false,
                data: {},
                message: `Cannot upload image ${err}`
            })
        }
        var arrayOfFiles = files["image"]
        console.log(arrayOfFiles)
        console.log("files.image.path:              ", files.image.path)
        if (arrayOfFiles?.length > 0) {
            var fileNames = []

        } else {
            res.json({
                result: true,
                data: files.image.path,

            })
            // res.json({
            //     result: false,
            //     data: {},
            // })
        }
    })
})


router.post('/upload', upload.array('image'), (req, res) => {
    const name = req.body.name;
    const age = req.body.age;

    // Tệp ảnh đã được lưu trữ trong thư mục 'uploads/'

    // Lấy đường dẫn tệp ảnh và lưu nó vào cơ sở dữ liệu
    const imagePath = req.files.map(file => file.path);
    console.log(imagePath);
    // Điều này phụ thuộc vào loại cơ sở dữ liệu bạn đang sử dụng

    //res.status(200).json({ message: 'Tải ảnh thành công', imagePath: imagePath });
});

module.exports = router