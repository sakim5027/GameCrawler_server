'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game_genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      game_genre.belongsTo(models.game, {
        foreignKey: 'game_id'
      });
      game_genre.belongsTo(models.genre, {
        foreignKey: 'genre_id'
      });
    }
  };
  game_genre.init({
    game_id: DataTypes.INTEGER,
    genre_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'game_genre',
  });
  return game_genre;
};