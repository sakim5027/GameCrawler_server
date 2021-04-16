'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      story: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      graphic: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      hardness: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      music: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      ux: {
        type: Sequelize.CHAR(1),
        allowNull: false
      },
      contents: {
        type: Sequelize.STRING(5000)
      },
      use_yn: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue:"Y"

      },
      user_id: {
        type: Sequelize.STRING(20),
        allowNull: false
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
  }
};