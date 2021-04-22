'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review.belongsTo(models.game, {
        foreignKey: 'game_id'
      });
    }
  };
  review.init({
    game_id: DataTypes.NUMBER,
    rate: DataTypes.NUMBER,
    story: DataTypes.CHAR,
    graphic: DataTypes.CHAR,
    hardness: DataTypes.CHAR,
    music: DataTypes.CHAR,
    ux: DataTypes.CHAR,
    contents: DataTypes.STRING,
    use_yn: DataTypes.CHAR,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};