'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasMany(models.Cart, { foreignKey: "productId", as: 'productCartData' })
            Product.hasMany(models.History, { foreignKey: "productId", as: 'productHistoryData' })
            Product.hasMany(models.Review, { foreignKey: "productId", as: 'productReviewData' })
            Product.hasMany(models.Product_Type, { foreignKey: "productId", as: 'productTypeData' })
            Product.hasMany(models.Notifycation, { foreignKey: "productId", as: 'notifyProductData' })
            Product.belongsTo(models.User, { foreignKey: "supplierId", targetKey: "id", as: "productSupplierData" })
        }
    }
    Product.init({
        name: DataTypes.STRING,
        image: DataTypes.ARRAY(DataTypes.STRING),
        price: DataTypes.INTEGER,
        description: DataTypes.STRING,
        categoryId: DataTypes.STRING,
        supplierId: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        bought: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Product',
        freezeTableName: true

    });
    return Product;
};