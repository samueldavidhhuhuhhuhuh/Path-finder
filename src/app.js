const express = require('express');
const { sequelize, conectarDB } = require('./config/database');

// Models
const defineMapModel = require('./models/mapModel');
const defineObstacleModel = require('./models/obstacleModel');
const defineWaypointModel = require('./models/waypointModel');
const defineRouteModel = require('./models/routeModel');
const defineUserModel = require('./models/userModel');

// Repositories
const createMapRepository = require('./repositories/mapRepository');
const createObstacleRepository = require('./repositories/obstacleRepository');
const createWaypointRepository = require('./repositories/waypointRepository');
const createRouteRepository = require('./repositories/routeRepository');
const createUserRepository = require('./repositories/userRepository');

// Services
const createMapService = require('./services/mapService');
const createObstacleService = require('./services/obstacleService');
const createWaypointService = require('./services/waypointService');
const createRouteService = require('./services/routeService');
const createUserService = require('./services/userService');

// Controllers
const createMapController = require('./controllers/mapController');
const createObstacleController = require('./controllers/obstacleController');
const createWaypointController = require('./controllers/waypointController');
const createRouteController = require('./controllers/routeController');
const createUserController = require('./controllers/userController');
const createValidationController = require('./controllers/validationController');

// Routes
const createMapRouter = require('./routes/mapRoutes');
const createObstacleRouter = require('./routes/obstacleRoutes');
const createWaypointRouter = require('./routes/waypointRoutes');
const createRouteRouter = require('./routes/routeRoutes');
const createUserRouter = require('./routes/userRoutes');
const createValidationRouter = require('./routes/validationRoutes');

// Middlewares
const { requestLogger, errorLogger } = require('./middlewares/loggerMiddleware');
const performanceMonitor = require('./middlewares/performanceMonitor');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(requestLogger);
app.use(performanceMonitor);

// Initialize Models
const MapModel = defineMapModel(sequelize);
const ObstacleModel = defineObstacleModel(sequelize);
const WaypointModel = defineWaypointModel(sequelize);
const RouteModel = defineRouteModel(sequelize);
const UserModel = defineUserModel(sequelize);

// Initialize Repositories (LSP - todos implementan mismas interfaces)
const mapRepository = createMapRepository(MapModel);
const obstacleRepository = createObstacleRepository(ObstacleModel);
const waypointRepository = createWaypointRepository(WaypointModel);
const routeRepository = createRouteRepository(RouteModel);
const userRepository = createUserRepository(UserModel);

// Initialize Services (DIP - inyección de dependencias)
const mapService = createMapService(mapRepository);
const obstacleService = createObstacleService(obstacleRepository);
const waypointService = createWaypointService(waypointRepository);
const routeService = createRouteService(
  routeRepository,
  mapRepository,
  obstacleRepository,
  waypointRepository
);
const userService = createUserService(userRepository);

// Initialize Controllers
const mapController = createMapController(mapService);
const obstacleController = createObstacleController(obstacleService);
const waypointController = createWaypointController(waypointService);
const routeController = createRouteController(routeService);
const userController = createUserController(userService);
const validationController = createValidationController(mapService);

// Initialize Routes
const mapRouter = createMapRouter(mapController);
const obstacleRouter = createObstacleRouter(obstacleController);
const waypointRouter = createWaypointRouter(waypointController);
const routeRouter = createRouteRouter(routeController);
const userRouter = createUserRouter(userController);
const validationRouter = createValidationRouter(validationController);

// Mount Routes
app.use('/api/maps', mapRouter);
app.use('/api/obstacles', obstacleRouter);
app.use('/api/waypoints', waypointRouter);
app.use('/api/routes', routeRouter);
app.use('/api/users', userRouter);
app.use('/api/validate', validationRouter);

// Health check
app.get('/', (req, res) => res.json({ 
  message: 'PathFinder API v1.0 - SOLID Refactored',
  status: 'running',
  principles: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP'],
  features: ['validaciones avanzadas', 'logging', 'monitoreo de rendimiento']
}));

// Error logger middleware (debe ir al final)
app.use(errorLogger);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Servidor listo en http://localhost:${PORT}`);
    console.log('📊 Módulos activos: Maps, Obstacles, Waypoints, Routes, Users');
    console.log('✅ Principios SOLID aplicados\n');
  });
};

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
