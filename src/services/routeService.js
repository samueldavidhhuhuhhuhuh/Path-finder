/**
 * Dependency Inversion Principle (DIP) + Open/Closed Principle (OCP)
 * RouteService depende de abstracciones y usa estrategias intercambiables
 */
const Result = require('../utils/result');
const pathfindingStrategyFactory = require('../strategies/pathfindingStrategyFactory');
const MapConfigValidator = require('../validators/MapConfigValidator');
const logger = require('../utils/logger');

class RouteService {
  constructor(routeRepository, mapRepository, obstacleRepository, waypointRepository) {
    this.routeRepository = routeRepository;
    this.mapRepository = mapRepository;
    this.obstacleRepository = obstacleRepository;
    this.waypointRepository = waypointRepository;
  }

  async calculateRoute(data) {
    try {
      const { mapId, start, end, algorithm = 'astar' } = data;

      if (!mapId || !start || !end) {
        logger.warn('datos requeridos faltantes en calculateRoute');
        return Result.fail("faltan datos requeridos (mapId, start, end)");
      }

      if (start.x === end.x && start.y === end.y) {
        logger.info('puntos de inicio y destino identicos');
        return Result.ok({
          message: 'los puntos de inicio y destino son identicos. no se requiere calculo de ruta',
          optimized_path: [start],
          distance: 0,
          map_id: mapId
        });
      }

      const map = await this.mapRepository.findById(mapId);
      if (!map) {
        logger.warn(`mapa no encontrado: ${mapId}`);
        return Result.fail("mapa no encontrado");
      }

      const dimValidation = MapConfigValidator.validateDimensions(map.width, map.height);
      if (!dimValidation.isValid) {
        logger.warn(`dimensiones de mapa invalidas: ${map.width}x${map.height}`);
        return Result.fail(dimValidation.error);
      }

      const obstacles = await this.obstacleRepository.findAllByMapId(mapId);
      const waypoints = await this.waypointRepository.findAllByMapId(mapId);

      const obstaclePositions = obstacles.map(obs => ({ x: obs.x, y: obs.y }));

      const pointsValidation = MapConfigValidator.validatePointsNotObstructed(
        start, 
        end, 
        obstaclePositions
      );
      if (!pointsValidation.isValid) {
        logger.warn('puntos obstruidos');
        return Result.fail(pointsValidation.error);
      }

      const strategy = pathfindingStrategyFactory.getStrategy(algorithm);

      const sequence = [
        start,
        ...waypoints.map(wp => ({ x: wp.x, y: wp.y })),
        end
      ];

      const pathResult = this._calculateSegmentedPath(
        map.width,
        map.height,
        obstaclePositions,
        sequence,
        strategy
      );

      if (!pathResult.isValid) {
        return Result.fail(pathResult.error);
      }

      // Guardar ruta
      const routeData = {
        mapId,
        startX: start.x,
        startY: start.y,
        endX: end.x,
        endY: end.y,
        distance: pathResult.distance,
        path: pathResult.path
      };

      const savedRoute = await this.routeRepository.create(routeData);

      const response = {
        id: savedRoute.id,
        message: "La ruta óptima ha sido almacenada con éxito.",
        algorithm: strategy.getName(),
        optimized_path: pathResult.path,
        distance: pathResult.distance,
        map_id: mapId
      };

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  _calculateSegmentedPath(width, height, obstacles, sequence, strategy) {
    let fullPath = [];
    let totalDistance = 0;

    for (let i = 0; i < sequence.length - 1; i++) {
      const currentStart = sequence[i];
      const currentEnd = sequence[i + 1];

      const segmentPath = strategy.findPath(
        width,
        height,
        obstacles,
        currentStart,
        currentEnd
      );

      if (segmentPath.length === 0) {
        return {
          isValid: false,
          error: `No se encontró ruta entre (${currentStart.x},${currentStart.y}) y (${currentEnd.x},${currentEnd.y})`
        };
      }

      // Evitar duplicar puntos de conexión
      if (i > 0) {
        segmentPath.shift();
      }

      fullPath = [...fullPath, ...segmentPath];
    }

    totalDistance = fullPath.length - 1;

    return {
      isValid: true,
      path: fullPath,
      distance: totalDistance
    };
  }

  async getRoute(id) {
    try {
      const route = await this.routeRepository.findById(id);
      if (!route) {
        return Result.fail("Ruta no encontrada");
      }
      return Result.ok(route);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getAllRoutes() {
    try {
      const routes = await this.routeRepository.findAll();
      return Result.ok(routes);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

const createRouteService = (routeRepository, mapRepository, obstacleRepository, waypointRepository) => {
  return new RouteService(routeRepository, mapRepository, obstacleRepository, waypointRepository);
};

module.exports = createRouteService;
