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
            Account.hasOne(models.User, { foreignKey: "accountId", as: "accountUserData" })
        }
    }
    Account.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        roleId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Account',
        freezeTableName: true
    });
    return Account;
};