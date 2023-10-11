'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product_Type extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product_Type.belongsTo(models.Product, { foreignKey: "productId", targetKey: "id", as: "productTypeData" })
        }
    }
    Product_Type.init({
        productId: DataTypes.INTEGER,
        type: DataTypes.STRING,
        size: DataTypes.STRING,
        image: DataTypes.BLOB("tiny")
    }, {
        sequelize,
        modelName: 'Product_Type',
        freezeTableName: true
    });
    return Product_Type;
};