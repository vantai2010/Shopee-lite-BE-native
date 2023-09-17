'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Allcode.hasMany(models.User, { foreignKey: "genderId", as: 'genderUserData' })
      // Allcode.hasMany(models.User, { foreignKey: "roleId", as: 'roleData' })
      // Allcode.hasMany(models.Author, { foreignKey: "genderId", as: 'genderAuthorData' })
      // Allcode.hasMany(models.Book, { foreignKey: "categoryId", as: 'categoryData' })
      // Allcode.hasMany(models.Notifycation, { foreignKey: "titleId", as: 'notifyTitleData' })

    }
  }
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
    freezeTableName: true

  });
  return Allcode;
};