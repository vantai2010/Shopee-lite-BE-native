'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Promotion extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // User.belongsTo(models.Allcode, { foreignKey: 'genderId', targetKey: 'keyMap', as: 'genderUserData' })
            // User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' })
            // User.hasMany(models.History, { foreignKey: 'userId', as: 'userData' })
            // User.hasMany(models.Comment, { foreignKey: 'userId', as: 'userCommentData' })
            // User.hasMany(models.Cart, { foreignKey: 'userId', as: 'userCartData' })
        }
    }
    Promotion.init({
        userId: DataTypes.INTEGER,
        typeId: DataTypes.INTEGER,
        discount: DataTypes.FLOAT,
        conditionsPrice: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Promotion',
        freezeTableName: true
    });
    return Promotion;
};