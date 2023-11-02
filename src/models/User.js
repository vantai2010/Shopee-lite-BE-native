'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Cart, { foreignKey: "userId", as: 'userCartData' })
      User.hasMany(models.Cart, { foreignKey: "supplierId", as: 'userSupplierCartData' })
      User.hasMany(models.History, { foreignKey: "userId", as: 'userHistoryData' })
      User.hasMany(models.History, { foreignKey: "supplierId", as: 'supplierHistoryData' })
      User.hasMany(models.Review, { foreignKey: "userId", as: 'userReviewData' })
      User.hasMany(models.Interact, { foreignKey: "followedId", as: "userFollowingData" })
      User.hasMany(models.Interact, { foreignKey: "followerId", as: "userfollowedData" })
      User.hasMany(models.Product, { foreignKey: "supplierId", as: "productSupplierData" })
      User.hasMany(models.Chat, { foreignKey: "senderId", as: "senderChatData" })
      User.hasMany(models.Chat, { foreignKey: "receiverId", as: "receiverChatData" })
      User.belongsTo(models.Account, { foreignKey: "accountId", targetKey: "id", as: 'accountUserData' })
    }
  }
  User.init({
    accountId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    genderId: DataTypes.STRING,
    image: DataTypes.STRING,
    money: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};