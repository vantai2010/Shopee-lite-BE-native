'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Chat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Chat.belongsTo(models.User, { foreignKey: "senderId", targetKey: "id", as: "senderChatData" })
            Chat.belongsTo(models.User, { foreignKey: "receiverId", targetKey: "id", as: "receiverChatData" })

        }
    }
    Chat.init({
        senderId: DataTypes.INTEGER,
        receiverId: DataTypes.INTEGER,
        content: DataTypes.TEXT,
        time: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Chat',
        freezeTableName: true

    });
    return Chat;
};