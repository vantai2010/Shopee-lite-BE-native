'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Review.belongsTo(models.Product, { foreignKey: "productId", targetKey: "id", as: "productReviewData" })
            Review.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: "userReviewData" })
        }
    }
    Review.init({
        userId: DataTypes.INTEGER,
        productId: DataTypes.INTEGER,
        productType: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        comment: DataTypes.TEXT,
        time: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Review',
        freezeTableName: true
    });
    return Review;
};