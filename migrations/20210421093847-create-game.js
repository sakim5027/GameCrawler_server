'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      platforms_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      involved_companies_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      age_ratings: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      first_release_date: {
        type: 'TIMESTAMP',
        allowNull: false
      },
      cover_image_url: {
        type: Sequelize.STRING(200),
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
    await queryInterface.dropTable('games');
  }
};