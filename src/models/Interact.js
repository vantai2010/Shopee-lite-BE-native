'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Interact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Interact.belongsTo(models.User, { foreignKey: "followedId", targetKey: "id", as: "userFollowingData" })
      Interact.belongsTo(models.User, { foreignKey: "followerId", targetKey: "id", as: "userfollowedData" })


    }
  }
  Interact.init({
    followerId: DataTypes.INTEGER,
    followedId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Interact',
    freezeTableName: true
  });
  return Interact;
};