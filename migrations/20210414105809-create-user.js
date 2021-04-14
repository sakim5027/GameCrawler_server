'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      nickname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING(30)
      },
      auth_key: {
        type: Sequelize.STRING(50)
      },
      use_yn: {
        type: Sequelize.CHAR(1),
        allowNull: false,
        defaultValue:"Y"
      },
      signout_date: {
        type: Sequelize.DATE
      },
      created_id: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      updated_id: {
        type: Sequelize.STRING(20),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  }
};