const findPath = require('../../src/utils/aStar');

describe('Pruebas Unitarias: Algoritmo A* (Puntos 8 y 9)', () => {
  test('Debe encontrar un camino recto simple sin obstáculos', () => {
    const width = 5, height = 5;
    const obstacles = [];
    const start = { x: 0, y: 0 };
    const end = { x: 4, y: 0 };
    
    const path = findPath(width, height, obstacles, start, end);
    
    expect(path).toHaveLength(5);
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual(end);
  });

  test('Debe esquivar un obstáculo simple', () => {
    const width = 5, height = 5;
    const obstacles = [{ x: 1, y: 0 }];
    const start = { x: 0, y: 0 };
    const end = { x: 2, y: 0 };
    
    const path = findPath(width, height, obstacles, start, end);
    
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual(end);
    expect(path).not.toContainEqual(obstacles[0]);
  });

  test('Debe retornar array vacío si no hay camino posible', () => {
    const width = 3, height = 3;
    const obstacles = [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }
    ];
    const start = { x: 0, y: 1 };
    const end = { x: 2, y: 1 };
    
    const path = findPath(width, height, obstacles, start, end);
    
    expect(path).toEqual([]);
  });
});
