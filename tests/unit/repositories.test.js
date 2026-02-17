const createMapRepository = require('../../src/repositories/mapRepository');
const createUserRepository = require('../../src/repositories/userRepository');
const createObstacleRepository = require('../../src/repositories/obstacleRepository');
const createWaypointRepository = require('../../src/repositories/waypointRepository');
const createRouteRepository = require('../../src/repositories/routeRepository');

describe('Tests de Cobertura - Repositories', () => {
  describe('MapRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
      mockModel = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findByPk: jest.fn(id => Promise.resolve({ id, name: 'Test', width: 10, height: 10 })),
        findAll: jest.fn(() => Promise.resolve([{ id: 1, name: 'Test' }])),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
      };
      repository = createMapRepository(mockModel);
    });

    test('create debe crear un mapa', async () => {
      const result = await repository.create({ name: 'Test', width: 10, height: 10 });
      expect(result.id).toBe(1);
      expect(mockModel.create).toHaveBeenCalled();
    });

    test('findById debe encontrar un mapa', async () => {
      const result = await repository.findById(1);
      expect(result.id).toBe(1);
      expect(mockModel.findByPk).toHaveBeenCalledWith(1);
    });

    test('findAll debe retornar todos los mapas', async () => {
      const result = await repository.findAll();
      expect(result).toHaveLength(1);
      expect(mockModel.findAll).toHaveBeenCalled();
    });

    test('update debe actualizar un mapa', async () => {
      const result = await repository.update(1, { name: 'Updated' });
      expect(result).toBe(true);
      expect(mockModel.update).toHaveBeenCalled();
    });

    test('update debe retornar false si no se actualiza', async () => {
      mockModel.update.mockResolvedValue([0]);
      const result = await repository.update(1, { name: 'Updated' });
      expect(result).toBe(false);
    });

    test('delete debe eliminar un mapa', async () => {
      const result = await repository.delete(1);
      expect(result).toBe(1);
      expect(mockModel.destroy).toHaveBeenCalled();
    });
  });

  describe('UserRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
      mockModel = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findByPk: jest.fn(id => Promise.resolve({ id, username: 'test' })),
        findAll: jest.fn(() => Promise.resolve([{ id: 1 }])),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
      };
      repository = createUserRepository(mockModel);
    });

    test('create debe crear un usuario', async () => {
      const result = await repository.create({ username: 'test', email: 'test@test.com' });
      expect(result.id).toBe(1);
    });

    test('findById debe encontrar un usuario', async () => {
      const result = await repository.findById(1);
      expect(result.id).toBe(1);
    });

    test('findAll debe retornar todos los usuarios', async () => {
      const result = await repository.findAll();
      expect(result).toHaveLength(1);
    });

    test('update debe actualizar un usuario', async () => {
      const result = await repository.update(1, { username: 'updated' });
      expect(result).toBe(true);
    });

    test('delete debe eliminar un usuario', async () => {
      const result = await repository.delete(1);
      expect(result).toBe(1);
    });
  });

  describe('ObstacleRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
      mockModel = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findByPk: jest.fn(id => Promise.resolve({ id })),
        findAll: jest.fn(() => Promise.resolve([])),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
      };
      repository = createObstacleRepository(mockModel);
    });

    test('findAllByMapId debe encontrar obstáculos por mapId', async () => {
      mockModel.findAll.mockResolvedValue([{ id: 1, mapId: 1 }]);
      const result = await repository.findAllByMapId(1);
      expect(mockModel.findAll).toHaveBeenCalledWith({ where: { mapId: 1 } });
    });

    test('create debe crear un obstáculo', async () => {
      const result = await repository.create({ mapId: 1, x: 5, y: 5 });
      expect(result.id).toBe(1);
    });

    test('findById debe encontrar un obstáculo', async () => {
      const result = await repository.findById(1);
      expect(result.id).toBe(1);
    });

    test('findAll debe retornar todos los obstáculos', async () => {
      const result = await repository.findAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test('update debe actualizar un obstáculo', async () => {
      const result = await repository.update(1, { x: 10 });
      expect(result).toBe(true);
    });

    test('delete debe eliminar un obstáculo', async () => {
      const result = await repository.delete(1);
      expect(result).toBe(1);
    });
  });

  describe('WaypointRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
      mockModel = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findByPk: jest.fn(id => Promise.resolve({ id })),
        findAll: jest.fn(() => Promise.resolve([])),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
      };
      repository = createWaypointRepository(mockModel);
    });

    test('findAllByMapId debe encontrar waypoints por mapId', async () => {
      mockModel.findAll.mockResolvedValue([{ id: 1, mapId: 1 }]);
      const result = await repository.findAllByMapId(1);
      expect(mockModel.findAll).toHaveBeenCalledWith({ where: { mapId: 1 } });
    });

    test('create debe crear un waypoint', async () => {
      const result = await repository.create({ mapId: 1, x: 3, y: 3 });
      expect(result.id).toBe(1);
    });

    test('findById debe encontrar un waypoint', async () => {
      const result = await repository.findById(1);
      expect(result.id).toBe(1);
    });

    test('findAll debe retornar todos los waypoints', async () => {
      const result = await repository.findAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test('update debe actualizar un waypoint', async () => {
      const result = await repository.update(1, { x: 7 });
      expect(result).toBe(true);
    });

    test('delete debe eliminar un waypoint', async () => {
      const result = await repository.delete(1);
      expect(result).toBe(1);
    });
  });

  describe('RouteRepository', () => {
    let repository;
    let mockModel;

    beforeEach(() => {
      mockModel = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findByPk: jest.fn(id => Promise.resolve({ id })),
        findAll: jest.fn(() => Promise.resolve([])),
        update: jest.fn(() => Promise.resolve([1])),
        destroy: jest.fn(() => Promise.resolve(1))
      };
      repository = createRouteRepository(mockModel);
    });

    test('create debe crear una ruta', async () => {
      const routeData = {
        mapId: 1,
        startX: 0,
        startY: 0,
        endX: 5,
        endY: 5,
        distance: 10,
        path: []
      };
      const result = await repository.create(routeData);
      expect(result.id).toBe(1);
    });

    test('findById debe encontrar una ruta', async () => {
      const result = await repository.findById(1);
      expect(result.id).toBe(1);
    });

    test('findAll debe retornar todas las rutas', async () => {
      const result = await repository.findAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test('update debe actualizar una ruta', async () => {
      const result = await repository.update(1, { distance: 15 });
      expect(result).toBe(true);
    });

    test('delete debe eliminar una ruta', async () => {
      const result = await repository.delete(1);
      expect(result).toBe(1);
    });
  });
});
