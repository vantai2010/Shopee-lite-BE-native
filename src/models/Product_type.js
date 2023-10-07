'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product_type extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    Product_type.init({
        productId: DataTypes.STRING,
        type: DataTypes.STRING,
        image: DataTypes.BLOB("medium")
    }, {
        sequelize,
        modelName: 'Product_type',
        freezeTableName: true
    });
    return Product_type;
};