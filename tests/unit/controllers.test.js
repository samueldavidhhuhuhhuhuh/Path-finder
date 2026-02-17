const createMapController = require('../../src/controllers/mapController');
const createObstacleController = require('../../src/controllers/obstacleController');
const createRouteController = require('../../src/controllers/routeController');
const createWaypointController = require('../../src/controllers/waypointController');
const createUserController = require('../../src/controllers/userController');
const Result = require('../../src/utils/result');

describe('Controladores Coverage Total', () => {
  test('MapController Coverage', async () => {
    const mockService = {
      createMap: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getMapById: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getAllMaps: jest.fn(() => Promise.resolve(Result.ok([]))),
      updateMap: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      deleteMap: jest.fn(() => Promise.resolve(Result.ok({ message: 'deleted' })))
    };
    
    const controller = createMapController(mockService);
    const mockReq = { body: {}, params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await controller.create(mockReq, mockRes);
    await controller.getOne(mockReq, mockRes);
    await controller.getAll(mockReq, mockRes);
    await controller.update(mockReq, mockRes);
    await controller.delete(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalled();
  });

  test('ObstacleController Coverage', async () => {
    const mockService = {
      createObstacle: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getObstacleById: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getAllObstacles: jest.fn(() => Promise.resolve(Result.ok([]))),
      updateObstacle: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      deleteObstacle: jest.fn(() => Promise.resolve(Result.ok({ message: 'deleted' })))
    };
    
    const controller = createObstacleController(mockService);
    const mockReq = { body: {}, params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await controller.create(mockReq, mockRes);
    await controller.getOne(mockReq, mockRes);
    await controller.getAll(mockReq, mockRes);
    await controller.update(mockReq, mockRes);
    await controller.delete(mockReq, mockRes);
    
    expect(mockRes.json).toHaveBeenCalled();
  });

  test('RouteController Coverage', async () => {
    const mockService = {
      calculateRoute: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getRoute: jest.fn(() => Promise.resolve(Result.ok({ id: 1 })))
    };
    
    const controller = createRouteController(mockService);
    const mockReq = { body: {}, params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await controller.calculate(mockReq, mockRes);
    await controller.getOne(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalled();
  });

  test('WaypointController Coverage', async () => {
    const mockService = {
      createWaypoint: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getWaypointById: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getAllWaypoints: jest.fn(() => Promise.resolve(Result.ok([]))),
      updateWaypoint: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      deleteWaypoint: jest.fn(() => Promise.resolve(Result.ok({ message: 'deleted' })))
    };
    
    const controller = createWaypointController(mockService);
    const mockReq = { body: {}, params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await controller.create(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalled();
  });

  test('UserController Coverage', async () => {
    const mockService = {
      createUser: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getUserById: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      getAllUsers: jest.fn(() => Promise.resolve(Result.ok([]))),
      updateUser: jest.fn(() => Promise.resolve(Result.ok({ id: 1 }))),
      deleteUser: jest.fn(() => Promise.resolve(Result.ok({ message: 'deleted' })))
    };
    
    const controller = createUserController(mockService);
    const mockReq = { body: {}, params: { id: 1 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    await controller.create(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalled();
  });
});
