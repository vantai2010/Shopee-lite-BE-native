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
      User.hasMany(models.History, { foreignKey: "userId", as: 'userHistoryData' })
      User.hasMany(models.Review, { foreignKey: "userId", as: 'userReviewData' })
      // User.hasOne(models.Account, { foreignKey: "userId", as: 'accountUserData' })
    }
  }
  User.init({
    accountId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.TEXT,
    phoneNumber: DataTypes.INTEGER,
    genderId: DataTypes.STRING,
    image: DataTypes.BLOB('medium'),
    money: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true
  });
  return User;
};