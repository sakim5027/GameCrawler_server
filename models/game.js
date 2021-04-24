'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      game.belongsToMany(models.genre, {
        through: 'game_genre',
        foreignKey: 'game_id'
      });

      game.hasMany(models.review, {
        foreignKey: 'game_id'
      });

      game.hasMany(models.interest, {
        foreignKey: 'game_id'
      });
    }
  };
  game.init({
    name: DataTypes.STRING,
    platforms_name: DataTypes.STRING,
    involved_companies_name: DataTypes.STRING,
    age_ratings: DataTypes.STRING,
    first_release_date: DataTypes.DATE,
    cover_image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'game',
  });
  return game;
};