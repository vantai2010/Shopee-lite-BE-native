'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER
      },
      productId: {
        type: Sequelize.INTEGER
      },
      supplierId: {
        type: Sequelize.INTEGER
      },
      productTypeId: {
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      productFee: {
        type: Sequelize.INTEGER
      },
      shipFee: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.STRING
      },
      timeStart: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart');
  }
};