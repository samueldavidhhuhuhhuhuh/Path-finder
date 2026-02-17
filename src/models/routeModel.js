const { DataTypes } = require('sequelize');

const defineRouteModel = (sequelize) => {
  const Route = sequelize.define('Route', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mapId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startX: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startY: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endX: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endY: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    path: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });

  return Route;
};

module.exports = defineRouteModel;
