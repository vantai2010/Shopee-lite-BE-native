'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Account extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Account.hasOne(models.User, { foreignKey: "userId", targetKey: "id", as: "accountUserData" })
        }
    }
    Account.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        roleId: DataTypes.STRING,
        userId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Account',
        freezeTableName: true
    });
    return Account;
};