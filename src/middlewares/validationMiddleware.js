const UUIDValidator = require('../validators/UUIDValidator');
const MapConfigValidator = require('../validators/MapConfigValidator');
const logger = require('../utils/logger');

const validateMapId = (req, res, next) => {
  const mapId = req.params.id || req.body.mapId;
  
  if (!mapId) {
    logger.warn('intento de acceso sin mapid');
    return res.status(400).json({ error: 'el id del mapa es requerido' });
  }

  const validation = UUIDValidator.validate(mapId);
  
  if (!validation.isValid) {
    logger.warn(`formato de uuid invalido: ${mapId}`);
    return res.status(400).json({ error: validation.error });
  }

  next();
};

const validateMapConfig = (req, res, next) => {
  const { mapConfig } = req.body;

  const validation = MapConfigValidator.validateObstaclesAndWaypoints(mapConfig);
  
  if (!validation.isValid) {
    logger.warn('configuracion de mapa invalida');
    return res.status(400).json({ error: validation.error });
  }

  next();
};

const validateMapDimensions = (req, res, next) => {
  const { width, height } = req.body.dimensions || req.body;

  const validation = MapConfigValidator.validateDimensions(width, height);
  
  if (!validation.isValid) {
    logger.warn(`dimensiones invalidas: ${width}x${height}`);
    return res.status(400).json({ error: validation.error });
  }

  next();
};

const validateRoutePoints = (req, res, next) => {
  const { start, end, obstacles = [] } = req.body;

  const validation = MapConfigValidator.validatePointsNotObstructed(start, end, obstacles);
  
  if (!validation.isValid) {
    logger.warn('puntos de ruta obstruidos');
    return res.status(400).json({ error: validation.error });
  }

  if (validation.message) {
    return res.status(200).json({ message: validation.message });
  }

  next();
};

const validateCyclicDependencies = (req, res, next) => {
  const { connections } = req.body.mapConfig || {};

  if (!connections) {
    return next();
  }

  const result = MapConfigValidator.detectCycles(connections);
  
  if (result.hasCycle) {
    logger.warn('dependencia ciclica detectada');
    return res.status(400).json({ error: result.error });
  }

  next();
};

const validateRouteLength = (req, res, next) => {
  const { path } = req.body;

  if (!path) {
    return next();
  }

  const validation = MapConfigValidator.validateRouteLength(path);
  
  if (!validation.isValid) {
    logger.warn(`longitud de ruta excesiva: ${path.length}`);
    return res.status(400).json({ error: validation.error });
  }

  next();
};

const validateRouteIntersections = (req, res, next) => {
  const { path, obstacles = [] } = req.body;

  if (!path) {
    return next();
  }

  const validation = MapConfigValidator.validateRouteIntersections(path, obstacles);
  
  if (!validation.isValid) {
    logger.warn('ruta con intersecciones detectada');
    return res.status(400).json({ error: validation.error });
  }

  next();
};

module.exports = {
  validateMapId,
  validateMapConfig,
  validateMapDimensions,
  validateRoutePoints,
  validateCyclicDependencies,
  validateRouteLength,
  validateRouteIntersections
};
