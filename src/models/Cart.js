'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Product, { foreignKey: "productId", targetKey: "id", as: 'productCartData' })
            Cart.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: 'userCartData' })
            Cart.belongsTo(models.User, { foreignKey: "supplierId", targetKey: "id", as: 'userSupplierCartData' })
            Cart.belongsTo(models.Product_Type, { foreignKey: "productTypeId", targetKey: "id", as: 'productTypeCartData' })
        }
    }
    Cart.init({
        userId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        supplierId: DataTypes.INTEGER,
        productTypeId: DataTypes.INTEGER,
        statusId: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        productFee: DataTypes.INTEGER,
        shipFee: DataTypes.INTEGER,
        time: DataTypes.STRING,
        timeStart: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Cart',
        freezeTableName: true

    });
    return Cart;
};