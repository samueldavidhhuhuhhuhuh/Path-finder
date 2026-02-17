const createMapService = require('../../src/services/mapService');
const createUserService = require('../../src/services/userService');
const createObstacleService = require('../../src/services/obstacleService');
const createWaypointService = require('../../src/services/waypointService');

describe('Tests de Cobertura - Servicios (Casos de Error)', () => {
  describe('MapService - Casos de Error', () => {
    test('createMap debe fallar sin nombre', async () => {
      const mockRepo = {
        create: jest.fn()
      };
      const service = createMapService(mockRepo);
      
      const result = await service.createMap({ width: 10, height: 10 });
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('nombre');
    });

    test('createMap debe fallar con dimensiones inválidas', async () => {
      const mockRepo = {
        create: jest.fn()
      };
      const service = createMapService(mockRepo);
      
      const result = await service.createMap({ name: 'Test', width: 0, height: 10 });
      
      expect(result.isError).toBe(true);
    });

    test('getMapById debe fallar si no existe', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.getMapById(999);
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('no encontrado');
    });

    test('updateMap debe fallar si no existe', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.updateMap(999, { name: 'Updated' });
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('no encontrado');
    });

    test('updateMap debe validar nuevas dimensiones', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve({ id: 1, width: 10, height: 10 }))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.updateMap(1, { width: -5 });
      
      expect(result.isError).toBe(true);
    });

    test('updateMap debe actualizar correctamente', async () => {
      const mockRepo = {
        findById: jest.fn()
          .mockResolvedValueOnce({ id: 1, width: 10, height: 10, name: 'Test', obstaclesConfig: [] })
          .mockResolvedValueOnce({ id: 1, width: 10, height: 10, name: 'Updated', obstaclesConfig: [] }),
        update: jest.fn(() => Promise.resolve(true))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.updateMap(1, { name: 'Updated' });
      
      expect(result.isError).toBe(false);
      expect(result.value.name).toBe('Updated');
    });

    test('deleteMap debe fallar si no existe', async () => {
      const mockRepo = {
        delete: jest.fn(() => Promise.resolve(0))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.deleteMap(999);
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('no encontrado');
    });

    test('getAllMaps debe manejar errores', async () => {
      const mockRepo = {
        findAll: jest.fn(() => Promise.reject(new Error('DB error')))
      };
      const service = createMapService(mockRepo);
      
      const result = await service.getAllMaps();
      
      expect(result.isError).toBe(true);
    });
  });

  describe('UserService - Casos de Error', () => {
    test('createUser debe fallar sin username', async () => {
      const mockRepo = {};
      const service = createUserService(mockRepo);
      
      const result = await service.createUser({ email: 'test@test.com' });
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('Username');
    });

    test('createUser debe fallar sin email', async () => {
      const mockRepo = {};
      const service = createUserService(mockRepo);
      
      const result = await service.createUser({ username: 'test' });
      
      expect(result.isError).toBe(true);
      expect(result.error).toContain('Email');
    });

    test('getUserById debe fallar si no existe', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createUserService(mockRepo);
      
      const result = await service.getUserById(999);
      
      expect(result.isError).toBe(true);
    });

    test('updateUser debe fallar si no existe', async () => {
      const mockRepo = {
        update: jest.fn(() => Promise.resolve(false))
      };
      const service = createUserService(mockRepo);
      
      const result = await service.updateUser(999, { username: 'updated' });
      
      expect(result.isError).toBe(true);
    });

    test('deleteUser debe fallar si no existe', async () => {
      const mockRepo = {
        delete: jest.fn(() => Promise.resolve(0))
      };
      const service = createUserService(mockRepo);
      
      const result = await service.deleteUser(999);
      
      expect(result.isError).toBe(true);
    });
  });

  describe('ObstacleService - Casos de Error', () => {
    test('createObstacle debe fallar sin mapId', async () => {
      const mockRepo = {};
      const service = createObstacleService(mockRepo);
      
      const result = await service.createObstacle({ x: 5, y: 5 });
      
      expect(result.isError).toBe(true);
    });

    test('createObstacle debe fallar sin coordenadas', async () => {
      const mockRepo = {};
      const service = createObstacleService(mockRepo);
      
      const result = await service.createObstacle({ mapId: 1 });
      
      expect(result.isError).toBe(true);
    });

    test('getObstacleById debe fallar si no existe', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createObstacleService(mockRepo);
      
      const result = await service.getObstacleById(999);
      
      expect(result.isError).toBe(true);
    });

    test('updateObstacle debe fallar si no existe', async () => {
      const mockRepo = {
        update: jest.fn(() => Promise.resolve(false)),
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createObstacleService(mockRepo);
      
      const result = await service.updateObstacle(999, { x: 10 });
      
      expect(result.isError).toBe(true);
    });

    test('deleteObstacle debe fallar si no existe', async () => {
      const mockRepo = {
        delete: jest.fn(() => Promise.resolve(0))
      };
      const service = createObstacleService(mockRepo);
      
      const result = await service.deleteObstacle(999);
      
      expect(result.isError).toBe(true);
    });
  });

  describe('WaypointService - Casos de Error', () => {
    test('createWaypoint debe fallar sin mapId', async () => {
      const mockRepo = {};
      const service = createWaypointService(mockRepo);
      
      const result = await service.createWaypoint({ x: 5, y: 5 });
      
      expect(result.isError).toBe(true);
    });

    test('getWaypointById debe fallar si no existe', async () => {
      const mockRepo = {
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createWaypointService(mockRepo);
      
      const result = await service.getWaypointById(999);
      
      expect(result.isError).toBe(true);
    });

    test('updateWaypoint debe fallar si no existe', async () => {
      const mockRepo = {
        update: jest.fn(() => Promise.resolve(false)),
        findById: jest.fn(() => Promise.resolve(null))
      };
      const service = createWaypointService(mockRepo);
      
      const result = await service.updateWaypoint(999, { x: 10 });
      
      expect(result.isError).toBe(true);
    });

    test('deleteWaypoint debe fallar si no existe', async () => {
      const mockRepo = {
        delete: jest.fn(() => Promise.resolve(0))
      };
      const service = createWaypointService(mockRepo);
      
      const result = await service.deleteWaypoint(999);
      
      expect(result.isError).toBe(true);
    });
  });
});
