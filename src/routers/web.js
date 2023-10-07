const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const verifyToken = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')
const checkSupplier = require('../middleware/checkSupplier')
const supplierController = require('../controllers/supplierController')

router.post("/register", userController.registerAccount)
router.post("/register-information", userController.registerInformation)
router.post("/login", userController.loginAccount)
router.post("/login-token", verifyToken, userController.loginAccountWithToken)
router.post("/update-information", verifyToken, userController.updateInformation)
router.post("/update-bank-for-user", verifyToken, userController.updateBankForUser)
router.put("/add-money", verifyToken, userController.addMoney)
router.get("/get-all-cart", verifyToken, userController.getAllCart)
router.delete("/delete-product-to-cart", verifyToken, userController.deleteProductFromCart)
router.put("/update-quantity-cart", verifyToken, userController.updateQuantityCart)

router.post("/create-product-by-supplier", checkSupplier, supplierController.createNewProduct)
router.get("/get-product-by-supplierId", checkSupplier, supplierController.getProductBySupplierId)
router.get("/get-product-on-transaction", checkSupplier, supplierController.getProductOnTransaction)
router.get("/get-history-transaction", checkSupplier, supplierController.getHistoryTransaction)
router.put("/update-product-by-supplier", checkSupplier, supplierController.updateProductBySupplier)
router.delete("/delete-product-by-supplier", checkSupplier, supplierController.deleteProductBySupplier)



module.exports = router