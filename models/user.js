'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    user_id: DataTypes.STRING,
    password: DataTypes.STRING,
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    genre: DataTypes.STRING,
    auth_key: DataTypes.STRING,
    use_yn: DataTypes.CHAR,
    signout_date: DataTypes.DATE,
    created_id: DataTypes.STRING,
    updated_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};