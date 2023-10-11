const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')
const checkSupplier = require('../middleware/checkSupplier')
const supplierController = require('../controllers/supplierController')
const appController = require('../controllers/appController')

router.post("/register", userController.registerAccount)
router.post("/register-information", userController.registerInformation)
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


router.post("/create-product-by-supplier", checkSupplier, supplierController.createNewProduct)
router.get("/get-product-by-supplierId", checkSupplier, supplierController.getProductBySupplierId)
router.get("/get-product-on-transaction", checkSupplier, supplierController.getProductOnTransaction)
router.get("/get-history-transaction", checkSupplier, supplierController.getHistoryTransaction)
router.put("/update-product-by-supplier", checkSupplier, supplierController.updateProductBySupplier)
router.delete("/delete-product-by-supplier", checkSupplier, supplierController.deleteProductBySupplier)
router.put("/confirm-packing-product-success", checkSupplier, supplierController.confirmPackingProductSuccess)

router.get("/get-product", appController.getProduct)
router.get("/get-product-detail", appController.getProductDetail)

router.get("/get-product-by-admin", checkAdmin, adminController.getProductByAdmin)
router.get("/get-all-users", checkAdmin, adminController.getAllUsers)

module.exports = router