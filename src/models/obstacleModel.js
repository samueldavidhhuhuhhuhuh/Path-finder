const { DataTypes } = require('sequelize');

const defineObstacleModel = (sequelize) => {
  const Obstacle = sequelize.define('Obstacle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mapId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    x: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Obstacle;
};

module.exports = defineObstacleModel;
