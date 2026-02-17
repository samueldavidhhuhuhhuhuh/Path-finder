const { DataTypes } = require('sequelize');

const defineMapModel = (sequelize) => {
  const Map = sequelize.define('Map', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    obstaclesConfig: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  });

  return Map;
};

module.exports = defineMapModel;
