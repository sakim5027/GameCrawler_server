'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class interest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      interest.belongsTo(models.game, {
        foreignKey: 'game_id'
      });
    }
  };
  interest.init({
    game_id: DataTypes.INTEGER,
    use_yn: DataTypes.CHAR,
    user_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'interest',
  });
  return interest;
};