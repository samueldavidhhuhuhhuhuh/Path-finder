const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './pathfinder.sqlite',
  logging: false
});

const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos conectada y sincronizada');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  }
};

module.exports = { sequelize, conectarDB };
