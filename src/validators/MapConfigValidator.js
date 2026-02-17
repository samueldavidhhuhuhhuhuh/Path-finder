class MapConfigValidator {
  static validateObstaclesAndWaypoints(mapConfig, depth = 0) {
    if (depth > 100) {
      return { isValid: false, error: 'profundidad maxima de recursion alcanzada' };
    }

    if (!mapConfig || typeof mapConfig !== 'object') {
      return { isValid: false, error: 'la configuracion del mapa debe ser un objeto' };
    }

    const hasObstacles = Array.isArray(mapConfig.obstacles) || 
                         Array.isArray(mapConfig.obstaclesConfig);
    
    const hasStoppingPoints = Array.isArray(mapConfig.stoppingPoints) || 
                              Array.isArray(mapConfig.waypoints);

    if (!hasObstacles && !hasStoppingPoints) {
      return { 
        isValid: false, 
        error: 'la configuracion del mapa no incluye obstaculos o puntos de parada' 
      };
    }

    return { isValid: true };
  }

  static validateDimensions(width, height, maxWidth = 1000, maxHeight = 1000) {
    if (typeof width !== 'number' || typeof height !== 'number') {
      return { isValid: false, error: 'las dimensiones deben ser numeros' };
    }

    if (width <= 0 || height <= 0) {
      return { isValid: false, error: 'las dimensiones deben ser mayores a 0' };
    }

    if (width > maxWidth || height > maxHeight) {
      return { 
        isValid: false, 
        error: 'las dimensiones del mapa exceden los limites aceptables' 
      };
    }

    return { isValid: true };
  }

  static validatePointsNotObstructed(start, end, obstacles) {
    if (!start || !end) {
      return { isValid: false, error: 'puntos de inicio y destino son requeridos' };
    }

    if (start.x === end.x && start.y === end.y) {
      return { 
        isValid: true, 
        message: 'los puntos de inicio y destino son identicos. no se requiere calculo de ruta.' 
      };
    }

    const startObstructed = obstacles.some(o => o.x === start.x && o.y === start.y);
    const endObstructed = obstacles.some(o => o.x === end.x && o.y === end.y);

    if (startObstructed) {
      return { 
        isValid: false, 
        error: 'el punto de inicio esta obstruido por un obstaculo' 
      };
    }

    if (endObstructed) {
      return { 
        isValid: false, 
        error: 'el punto de destino esta obstruido por un obstaculo' 
      };
    }

    return { isValid: true };
  }

  static detectCycles(connections, visited = new Set(), recursionStack = new Set(), node = null) {
    if (!connections || connections.length === 0) {
      return { hasCycle: false };
    }

    if (node === null) {
      for (const conn of connections) {
        const result = this.detectCycles(connections, visited, recursionStack, conn.source);
        if (result.hasCycle) return result;
      }
      return { hasCycle: false };
    }

    if (recursionStack.has(node)) {
      return { 
        hasCycle: true, 
        error: 'se encontro una dependencia ciclica en la configuracion del mapa' 
      };
    }

    if (visited.has(node)) {
      return { hasCycle: false };
    }

    visited.add(node);
    recursionStack.add(node);

    const neighbors = connections.filter(c => c.source === node).map(c => c.target);
    for (const neighbor of neighbors) {
      const result = this.detectCycles(connections, visited, recursionStack, neighbor);
      if (result.hasCycle) return result;
    }

    recursionStack.delete(node);
    return { hasCycle: false };
  }

  static validateRouteLength(path, maxLength = 10000) {
    if (!Array.isArray(path)) {
      return { isValid: false, error: 'el camino debe ser un array' };
    }

    const length = path.length;

    if (length > maxLength) {
      return { 
        isValid: false, 
        error: 'la longitud de la ruta calculada excede los limites aceptables' 
      };
    }

    return { 
      isValid: true, 
      message: 'longitud de la ruta calculada dentro de limites aceptables' 
    };
  }

  static validateRouteIntersections(path, obstacles) {
    if (!Array.isArray(path) || !Array.isArray(obstacles)) {
      return { isValid: false, error: 'path y obstacles deben ser arrays' };
    }

    for (const point of path) {
      const intersects = obstacles.some(o => o.x === point.x && o.y === point.y);
      if (intersects) {
        return { 
          isValid: false, 
          error: 'la ruta calculada intersecta con obstaculos o puntos de parada' 
        };
      }
    }

    return { 
      isValid: true, 
      message: 'la ruta calculada no tiene intersecciones con obstaculos o puntos de parada' 
    };
  }
}

module.exports = MapConfigValidator;
