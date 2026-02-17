const createValidationController = require('../../src/controllers/validationController');
const Result = require('../../src/utils/result');

describe('Tests de ValidationController', () => {
  let validationController;
  let mockMapService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockMapService = {
      getMapById: jest.fn()
    };
    validationController = createValidationController(mockMapService);
    mockReq = { body: {}, params: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('validateMapIdFormat', () => {
    test('debe validar UUID correcto', async () => {
      mockReq.body.mapId = '3b47e69f-788d-4b19-b81b-0b4a2fd92799';
      
      await validationController.validateMapIdFormat(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'el formato del id del mapa es valido'
      });
    });

    test('debe fallar con UUID invalido', async () => {
      mockReq.body.mapId = 'invalid-uuid';
      
      await validationController.validateMapIdFormat(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'formato invalido del id del mapa'
      });
    });
  });

  describe('validateMapExists', () => {
    test('debe confirmar que el mapa existe', async () => {
      mockReq.body.mapId = '3b47e69f-788d-4b19-b81b-0b4a2fd92799';
      mockMapService.getMapById.mockResolvedValue(Result.ok({ id: 1 }));
      
      await validationController.validateMapExists(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'el id del mapa existe en la base de datos'
      });
    });

    test('debe fallar si el mapa no existe', async () => {
      mockReq.body.mapId = '3b47e69f-788d-4b19-b81b-0b4a2fd92799';
      mockMapService.getMapById.mockResolvedValue(Result.fail('not found'));
      
      await validationController.validateMapExists(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'el id del mapa no existe en la base de datos'
      });
    });
  });

  describe('validateMapConfig', () => {
    test('debe validar configuracion correcta', async () => {
      mockReq.body.mapConfig = { obstacles: [{x: 1, y: 1}] };
      
      await validationController.validateMapConfig(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'configuracion del mapa validada con exito'
      });
    });

    test('debe fallar con configuracion invalida', async () => {
      mockReq.body.mapConfig = {};
      
      await validationController.validateMapConfig(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateMapDimensions', () => {
    test('debe validar dimensiones correctas', async () => {
      mockReq.body = { width: 100, height: 80 };
      
      await validationController.validateMapDimensions(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'dimensiones del mapa dentro de limites aceptables'
      });
    });

    test('debe fallar con dimensiones invalidas', async () => {
      mockReq.body = { width: 2000, height: 2000 };
      
      await validationController.validateMapDimensions(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRoutePoints', () => {
    test('debe detectar puntos identicos', async () => {
      mockReq.body = {
        startPoint: { x: 5, y: 5 },
        endPoint: { x: 5, y: 5 },
        obstacles: []
      };
      
      await validationController.validateRoutePoints(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: expect.stringContaining('identicos')
      });
    });

    test('debe validar puntos no obstruidos', async () => {
      mockReq.body = {
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 5, y: 5 },
        obstacles: []
      };
      
      await validationController.validateRoutePoints(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debe fallar si punto esta obstruido', async () => {
      mockReq.body = {
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 5, y: 5 },
        obstacles: [{ x: 0, y: 0 }]
      };
      
      await validationController.validateRoutePoints(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('validateCyclicDependencies', () => {
    test('debe detectar dependencias ciclicas', async () => {
      mockReq.body.mapConfig = {
        connections: [
          { source: 'A', target: 'B' },
          { source: 'B', target: 'C' },
          { source: 'C', target: 'A' }
        ]
      };
      
      await validationController.validateCyclicDependencies(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: expect.stringContaining('dependencia ciclica')
      });
    });

    test('debe pasar sin ciclos', async () => {
      mockReq.body.mapConfig = {
        connections: [
          { source: 'A', target: 'B' }
        ]
      };
      
      await validationController.validateCyclicDependencies(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('validatePathExists', () => {
    test('debe confirmar ruta valida', async () => {
      mockReq.body = {
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 5, y: 5 },
        obstacles: []
      };
      
      await validationController.validatePathExists(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('validateRouteIntersections', () => {
    test('debe validar ruta sin intersecciones', async () => {
      mockReq.body = {
        path: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
        obstacles: [{ x: 5, y: 5 }]
      };
      
      await validationController.validateRouteIntersections(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debe detectar intersecciones', async () => {
      mockReq.body = {
        path: [{ x: 1, y: 1 }],
        obstacles: [{ x: 1, y: 1 }]
      };
      
      await validationController.validateRouteIntersections(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRouteLength', () => {
    test('debe validar longitud aceptable', async () => {
      mockReq.body.path = Array(100).fill({ x: 1, y: 1 });
      
      await validationController.validateRouteLength(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    test('debe fallar con longitud excesiva', async () => {
      mockReq.body.path = Array(15000).fill({ x: 1, y: 1 });
      
      await validationController.validateRouteLength(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
