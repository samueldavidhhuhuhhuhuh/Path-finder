const Result = require('../utils/result');
const UUIDValidator = require('../validators/UUIDValidator');
const MapConfigValidator = require('../validators/MapConfigValidator');
const logger = require('../utils/logger');

class ValidationController {
  constructor(mapService) {
    this.mapService = mapService;
  }

  validateMapIdFormat = async (req, res) => {
    const { mapId } = req.body || req.params;

    const validation = UUIDValidator.validate(mapId);

    if (validation.isValid) {
      logger.info('formato de id validado correctamente');
      return res.status(200).json({ message: 'el formato del id del mapa es valido' });
    }

    logger.warn('formato de id invalido');
    return res.status(400).json({ error: 'formato invalido del id del mapa' });
  }

  validateMapExists = async (req, res) => {
    const { mapId } = req.body || req.params;

    const result = await this.mapService.getMapById(mapId);

    result.match({
      ok: () => {
        logger.info('id de mapa existe en bd');
        res.status(200).json({ message: 'el id del mapa existe en la base de datos' });
      },
      fail: () => {
        logger.warn('id de mapa no encontrado');
        res.status(404).json({ error: 'el id del mapa no existe en la base de datos' });
      }
    });
  }

  validateMapConfig = async (req, res) => {
    const { mapConfig } = req.body;

    const validation = MapConfigValidator.validateObstaclesAndWaypoints(mapConfig);

    if (validation.isValid) {
      logger.info('configuracion de mapa validada');
      return res.status(200).json({ message: 'configuracion del mapa validada con exito' });
    }

    logger.warn('configuracion de mapa invalida');
    return res.status(400).json({ error: validation.error });
  }

  validateMapDimensions = async (req, res) => {
    const { width, height } = req.body;

    const validation = MapConfigValidator.validateDimensions(width, height);

    if (validation.isValid) {
      logger.info('dimensiones de mapa validadas');
      return res.status(200).json({ message: 'dimensiones del mapa dentro de limites aceptables' });
    }

    logger.warn('dimensiones de mapa invalidas');
    return res.status(400).json({ error: validation.error });
  }

  validateRoutePoints = async (req, res) => {
    const { startPoint, endPoint, obstacles = [] } = req.body;

    if (startPoint.x === endPoint.x && startPoint.y === endPoint.y) {
      logger.info('puntos de inicio y destino identicos');
      return res.status(200).json({ 
        message: 'los puntos de inicio y destino son identicos. no se requiere calculo de ruta' 
      });
    }

    const validation = MapConfigValidator.validatePointsNotObstructed(
      startPoint, 
      endPoint, 
      obstacles
    );

    if (validation.isValid) {
      logger.info('puntos de ruta validados');
      return res.status(200).json({ 
        message: 'se encontro al menos un camino valido entre el punto de inicio y el destino' 
      });
    }

    logger.warn('puntos de ruta obstruidos');
    return res.status(404).json({ error: validation.error });
  }

  validateCyclicDependencies = async (req, res) => {
    const { mapConfig } = req.body;
    const { connections } = mapConfig || {};

    const result = MapConfigValidator.detectCycles(connections);

    if (result.hasCycle) {
      logger.warn('dependencia ciclica detectada');
      return res.status(400).json({ error: result.error });
    }

    logger.info('no hay dependencias ciclicas');
    return res.status(200).json({ 
      message: 'no se encontraron dependencias ciclicas en la configuracion del mapa' 
    });
  }

  validatePathExists = async (req, res) => {
    const { startPoint, endPoint, obstacles = [] } = req.body;

    const validation = MapConfigValidator.validatePointsNotObstructed(
      startPoint, 
      endPoint, 
      obstacles
    );

    if (validation.isValid) {
      logger.info('ruta valida encontrada');
      return res.status(200).json({ 
        message: 'se encontro al menos una ruta valida desde el punto de inicio hasta el destino' 
      });
    }

    logger.warn('no hay ruta valida');
    return res.status(404).json({ 
      error: 'no hay ninguna ruta valida desde el punto de inicio hasta el destino' 
    });
  }

  validateRouteIntersections = async (req, res) => {
    const { path, obstacles = [] } = req.body;

    const validation = MapConfigValidator.validateRouteIntersections(path, obstacles);

    if (validation.isValid) {
      logger.info('ruta sin intersecciones');
      return res.status(200).json({ message: validation.message });
    }

    logger.warn('ruta con intersecciones');
    return res.status(400).json({ error: validation.error });
  }

  validateRouteLength = async (req, res) => {
    const { path } = req.body;

    const validation = MapConfigValidator.validateRouteLength(path);

    if (validation.isValid) {
      logger.info('longitud de ruta validada');
      return res.status(200).json({ message: validation.message });
    }

    logger.warn('longitud de ruta excesiva');
    return res.status(400).json({ error: validation.error });
  }
}

const createValidationController = (mapService) => new ValidationController(mapService);

module.exports = createValidationController;
