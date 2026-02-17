const UUIDValidator = require('../../src/validators/UUIDValidator');
const MapConfigValidator = require('../../src/validators/MapConfigValidator');

describe('Tests de Validadores Avanzados', () => {
  describe('UUIDValidator', () => {
    test('debe validar UUID correcto', () => {
      const result = UUIDValidator.validate('3b47e69f-788d-4b19-b81b-0b4a2fd92799');
      expect(result.isValid).toBe(true);
    });

    test('debe fallar con UUID invalido', () => {
      const result = UUIDValidator.validate('invalid-uuid');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('formato invalido');
    });

    test('debe fallar con UUID vacio', () => {
      const result = UUIDValidator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('requerido');
    });

    test('debe fallar con caracteres invalidos', () => {
      const result = UUIDValidator.validate('3b47e69f-788d-4b19-ZZZZ-0b4a2fd92799');
      expect(result.isValid).toBe(false);
    });

    test('debe validar formato con validateRecursive', () => {
      const result = UUIDValidator.validateRecursive('3b47e69f-788d-4b19-b81b-0b4a2fd92799');
      expect(result.isValid).toBe(true);
    });
  });

  describe('MapConfigValidator - obstaculos y waypoints', () => {
    test('debe validar config con obstaculos', () => {
      const config = {
        obstacles: [{x: 1, y: 1}]
      };
      const result = MapConfigValidator.validateObstaclesAndWaypoints(config);
      expect(result.isValid).toBe(true);
    });

    test('debe validar config con stoppingPoints', () => {
      const config = {
        stoppingPoints: [{x: 1, y: 1}]
      };
      const result = MapConfigValidator.validateObstaclesAndWaypoints(config);
      expect(result.isValid).toBe(true);
    });

    test('debe fallar sin obstaculos ni puntos', () => {
      const config = {};
      const result = MapConfigValidator.validateObstaclesAndWaypoints(config);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('no incluye obstaculos o puntos de parada');
    });

    test('debe detectar profundidad maxima de recursion', () => {
      const result = MapConfigValidator.validateObstaclesAndWaypoints({}, 101);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('profundidad maxima');
    });
  });

  describe('MapConfigValidator - dimensiones', () => {
    test('debe validar dimensiones correctas', () => {
      const result = MapConfigValidator.validateDimensions(100, 80);
      expect(result.isValid).toBe(true);
    });

    test('debe fallar con dimensiones negativas', () => {
      const result = MapConfigValidator.validateDimensions(-10, 80);
      expect(result.isValid).toBe(false);
    });

    test('debe fallar con dimensiones cero', () => {
      const result = MapConfigValidator.validateDimensions(0, 0);
      expect(result.isValid).toBe(false);
    });

    test('debe fallar con dimensiones excesivas', () => {
      const result = MapConfigValidator.validateDimensions(2000, 2000);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceden los limites');
    });

    test('debe validar con limites personalizados', () => {
      const result = MapConfigValidator.validateDimensions(150, 150, 200, 200);
      expect(result.isValid).toBe(true);
    });
  });

  describe('MapConfigValidator - puntos no obstruidos', () => {
    test('debe validar puntos sin obstaculos', () => {
      const start = {x: 0, y: 0};
      const end = {x: 5, y: 5};
      const obstacles = [{x: 2, y: 2}];
      const result = MapConfigValidator.validatePointsNotObstructed(start, end, obstacles);
      expect(result.isValid).toBe(true);
    });

    test('debe detectar puntos identicos', () => {
      const start = {x: 5, y: 5};
      const end = {x: 5, y: 5};
      const obstacles = [];
      const result = MapConfigValidator.validatePointsNotObstructed(start, end, obstacles);
      expect(result.isValid).toBe(true);
      expect(result.message).toContain('identicos');
    });

    test('debe fallar si inicio esta obstruido', () => {
      const start = {x: 0, y: 0};
      const end = {x: 5, y: 5};
      const obstacles = [{x: 0, y: 0}];
      const result = MapConfigValidator.validatePointsNotObstructed(start, end, obstacles);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('punto de inicio esta obstruido');
    });

    test('debe fallar si destino esta obstruido', () => {
      const start = {x: 0, y: 0};
      const end = {x: 5, y: 5};
      const obstacles = [{x: 5, y: 5}];
      const result = MapConfigValidator.validatePointsNotObstructed(start, end, obstacles);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('punto de destino esta obstruido');
    });
  });

  describe('MapConfigValidator - dependencias ciclicas', () => {
    test('debe detectar ciclo simple', () => {
      const connections = [
        {source: 'A', target: 'B'},
        {source: 'B', target: 'C'},
        {source: 'C', target: 'A'}
      ];
      const result = MapConfigValidator.detectCycles(connections);
      expect(result.hasCycle).toBe(true);
      expect(result.error).toContain('dependencia ciclica');
    });

    test('debe pasar sin ciclos', () => {
      const connections = [
        {source: 'A', target: 'B'},
        {source: 'B', target: 'C'}
      ];
      const result = MapConfigValidator.detectCycles(connections);
      expect(result.hasCycle).toBe(false);
    });

    test('debe manejar conexiones vacias', () => {
      const result = MapConfigValidator.detectCycles([]);
      expect(result.hasCycle).toBe(false);
    });

    test('debe manejar conexiones null', () => {
      const result = MapConfigValidator.detectCycles(null);
      expect(result.hasCycle).toBe(false);
    });
  });

  describe('MapConfigValidator - longitud de ruta', () => {
    test('debe validar longitud normal', () => {
      const path = Array(100).fill({x: 1, y: 1});
      const result = MapConfigValidator.validateRouteLength(path);
      expect(result.isValid).toBe(true);
    });

    test('debe fallar con longitud excesiva', () => {
      const path = Array(15000).fill({x: 1, y: 1});
      const result = MapConfigValidator.validateRouteLength(path);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('excede los limites');
    });

    test('debe validar con limite personalizado', () => {
      const path = Array(100).fill({x: 1, y: 1});
      const result = MapConfigValidator.validateRouteLength(path, 50);
      expect(result.isValid).toBe(false);
    });

    test('debe fallar si path no es array', () => {
      const result = MapConfigValidator.validateRouteLength('not-an-array');
      expect(result.isValid).toBe(false);
    });
  });

  describe('MapConfigValidator - intersecciones de ruta', () => {
    test('debe validar ruta sin intersecciones', () => {
      const path = [{x: 1, y: 1}, {x: 2, y: 2}];
      const obstacles = [{x: 5, y: 5}];
      const result = MapConfigValidator.validateRouteIntersections(path, obstacles);
      expect(result.isValid).toBe(true);
    });

    test('debe detectar interseccion', () => {
      const path = [{x: 1, y: 1}, {x: 2, y: 2}];
      const obstacles = [{x: 1, y: 1}];
      const result = MapConfigValidator.validateRouteIntersections(path, obstacles);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('intersecta');
    });

    test('debe manejar parametros invalidos', () => {
      const result = MapConfigValidator.validateRouteIntersections('invalid', 'invalid');
      expect(result.isValid).toBe(false);
    });
  });
});
