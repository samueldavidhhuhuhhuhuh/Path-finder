const dijkstraStrategy = require('../../src/strategies/dijkstraStrategy');
const pathfindingFactory = require('../../src/strategies/pathfindingStrategyFactory');

describe('Tests de Cobertura - Estrategia Dijkstra', () => {
  describe('DijkstraStrategy', () => {
    test('getName debe retornar "Dijkstra"', () => {
      expect(dijkstraStrategy.getName()).toBe('Dijkstra');
    });

    test('Debe encontrar un camino recto simple sin obstáculos', () => {
      const width = 5;
      const height = 5;
      const obstacles = [];
      const start = { x: 0, y: 0 };
      const end = { x: 4, y: 0 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path).toHaveLength(5);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(end);
    });

    test('Debe esquivar un obstáculo simple', () => {
      const width = 5;
      const height = 5;
      const obstacles = [{ x: 1, y: 0 }];
      const start = { x: 0, y: 0 };
      const end = { x: 2, y: 0 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(end);
      
      const hasObstacle = path.some(point => point.x === 1 && point.y === 0);
      expect(hasObstacle).toBe(false);
    });

    test('Debe retornar array vacío si no hay camino posible', () => {
      const width = 3;
      const height = 3;
      const obstacles = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 }
      ];
      const start = { x: 0, y: 1 };
      const end = { x: 2, y: 1 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path).toEqual([]);
    });

    test('Debe retornar array vacío si start está fuera del grid', () => {
      const width = 5;
      const height = 5;
      const obstacles = [];
      const start = { x: -1, y: 0 };
      const end = { x: 4, y: 0 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path).toEqual([]);
    });

    test('Debe retornar array vacío si end está fuera del grid', () => {
      const width = 5;
      const height = 5;
      const obstacles = [];
      const start = { x: 0, y: 0 };
      const end = { x: 10, y: 0 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path).toEqual([]);
    });

    test('Debe retornar array vacío si el destino es un obstáculo', () => {
      const width = 5;
      const height = 5;
      const obstacles = [{ x: 4, y: 0 }];
      const start = { x: 0, y: 0 };
      const end = { x: 4, y: 0 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path).toEqual([]);
    });

    test('Debe encontrar camino en un grid más grande', () => {
      const width = 10;
      const height = 10;
      const obstacles = [
        { x: 5, y: 0 }, { x: 5, y: 1 }, { x: 5, y: 2 },
        { x: 5, y: 3 }, { x: 5, y: 4 }
      ];
      const start = { x: 0, y: 2 };
      const end = { x: 9, y: 2 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toEqual(start);
      expect(path[path.length - 1]).toEqual(end);
    });

    test('Debe encontrar el camino más corto', () => {
      const width = 5;
      const height = 5;
      const obstacles = [];
      const start = { x: 0, y: 0 };
      const end = { x: 2, y: 2 };
      
      const path = dijkstraStrategy.findPath(width, height, obstacles, start, end);
      
      expect(path.length).toBe(5);
    });
  });

  describe('PathfindingStrategyFactory', () => {
    test('getStrategy debe retornar estrategia A*', () => {
      const strategy = pathfindingFactory.getStrategy('astar');
      expect(strategy.getName()).toBe('A*');
    });

    test('getStrategy debe retornar estrategia Dijkstra', () => {
      const strategy = pathfindingFactory.getStrategy('dijkstra');
      expect(strategy.getName()).toBe('Dijkstra');
    });

    test('getStrategy debe ser case-insensitive', () => {
      const strategy1 = pathfindingFactory.getStrategy('ASTAR');
      const strategy2 = pathfindingFactory.getStrategy('DiJkStRa');
      expect(strategy1.getName()).toBe('A*');
      expect(strategy2.getName()).toBe('Dijkstra');
    });

    test('getStrategy debe lanzar error si estrategia no existe', () => {
      expect(() => {
        pathfindingFactory.getStrategy('nonexistent');
      }).toThrow('no encontrada');
    });

    test('getAvailableStrategies debe retornar lista de estrategias', () => {
      const strategies = pathfindingFactory.getAvailableStrategies();
      expect(strategies).toContain('astar');
      expect(strategies).toContain('dijkstra');
      expect(strategies.length).toBe(2);
    });

    test('getStrategy debe usar astar por defecto', () => {
      const strategy = pathfindingFactory.getStrategy();
      expect(strategy.getName()).toBe('A*');
    });
  });
});
