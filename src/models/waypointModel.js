const { DataTypes } = require('sequelize');

const defineWaypointModel = (sequelize) => {
  const Waypoint = sequelize.define('Waypoint', {
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

  return Waypoint;
};

module.exports = defineWaypointModel;
