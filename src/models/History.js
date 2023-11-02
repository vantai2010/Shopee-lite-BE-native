'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Product, { foreignKey: "productId", targetKey: "id", as: 'productHistoryData' })
      History.belongsTo(models.Product_Type, { foreignKey: "productTypeId", targetKey: "id", as: 'productTypeHistoryData' })
      History.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: 'userHistoryData' })
      History.belongsTo(models.User, { foreignKey: "supplierId", targetKey: "id", as: 'supplierHistoryData' })
    }
  }
  History.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    productTypeId: DataTypes.INTEGER,
    supplierId: DataTypes.INTEGER,
    productFee: DataTypes.INTEGER,
    shipFee: DataTypes.INTEGER,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'History',
    freezeTableName: true
  });
  return History;
};