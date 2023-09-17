'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notifycation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


    }
  }
  Notifycation.init({
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    titleId: DataTypes.STRING,
    messageEn: DataTypes.TEXT,
    messageVi: DataTypes.TEXT,
    location: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Notifycation',
    freezeTableName: true

  });
  return Notifycation;
};