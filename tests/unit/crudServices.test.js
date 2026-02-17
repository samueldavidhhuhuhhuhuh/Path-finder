const createMapService = require('../../src/services/mapService');
const createUserService = require('../../src/services/userService');
const createObstacleService = require('../../src/services/obstacleService');
const createWaypointService = require('../../src/services/waypointService');

describe('Suite de Cobertura LAB 4 - Servicios', () => {
  describe('MapService Coverage', () => {
    test('Debe ejecutar todas las funciones de MapService', async () => {
      const mockRepo = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
        findById: jest.fn(id => Promise.resolve({ id, name: 'Test', width: 10, height: 10, obstaclesConfig: [] })),
        update: jest.fn(() => Promise.resolve(true)),
        delete: jest.fn(() => Promise.resolve(1))
      };
      
      const service = createMapService(mockRepo);
      
      await service.createMap({ name: 'Test', width: 10, height: 10 });
      await service.getAllMaps();
      await service.getMapById(1);
      await service.updateMap(1, { name: 'Updated' });
      await service.deleteMap(1);
      
      expect(mockRepo.create).toHaveBeenCalled();
      expect(mockRepo.findAll).toHaveBeenCalled();
      expect(mockRepo.findById).toHaveBeenCalled();
      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockRepo.delete).toHaveBeenCalled();
    });
  });

  describe('UserService Coverage', () => {
    test('Debe ejecutar todas las funciones de UserService', async () => {
      const mockRepo = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
        findById: jest.fn(id => Promise.resolve({ id, username: 'test', email: 'test@test.com' })),
        update: jest.fn(() => Promise.resolve(true)),
        delete: jest.fn(() => Promise.resolve(1))
      };
      
      const service = createUserService(mockRepo);
      
      await service.createUser({ username: 'test', email: 'test@test.com' });
      await service.getAllUsers();
      await service.getUserById(1);
      await service.updateUser(1, { username: 'updated' });
      await service.deleteUser(1);
      
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('ObstacleService Coverage', () => {
    test('Debe ejecutar todas las funciones de ObstacleService', async () => {
      const mockRepo = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
        findById: jest.fn(id => Promise.resolve({ id, mapId: 1, x: 0, y: 0 })),
        update: jest.fn(() => Promise.resolve(true)),
        delete: jest.fn(() => Promise.resolve(1))
      };
      
      const service = createObstacleService(mockRepo);
      
      await service.createObstacle({ mapId: 1, x: 0, y: 0 });
      await service.getAllObstacles();
      await service.getObstacleById(1);
      await service.updateObstacle(1, { x: 1 });
      await service.deleteObstacle(1);
      
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('WaypointService Coverage', () => {
    test('Debe ejecutar todas las funciones de WaypointService', async () => {
      const mockRepo = {
        create: jest.fn(data => Promise.resolve({ id: 1, ...data })),
        findAll: jest.fn(() => Promise.resolve([])),
        findById: jest.fn(id => Promise.resolve({ id, mapId: 1, x: 0, y: 0 })),
        update: jest.fn(() => Promise.resolve(true)),
        delete: jest.fn(() => Promise.resolve(1))
      };
      
      const service = createWaypointService(mockRepo);
      
      await service.createWaypoint({ mapId: 1, x: 0, y: 0 });
      await service.getAllWaypoints();
      await service.getWaypointById(1);
      await service.updateWaypoint(1, { x: 1 });
      await service.deleteWaypoint(1);
      
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});
