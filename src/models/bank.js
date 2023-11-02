'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bank.init({
    userId: DataTypes.INTEGER,
    numberBank: DataTypes.INTEGER,
    nameBank: DataTypes.STRING,
    passVerify: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bank',
    freezeTableName: true
  });
  return Bank;
};