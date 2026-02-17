const createRouteService = require('../../src/services/routeService');

describe('Pruebas Unitarias: Servicio de Rutas (Complejo)', () => {
  let routeService;
  let mockRouteRepo, mockMapRepo, mockObstacleRepo, mockWaypointRepo;

  beforeEach(() => {
    mockRouteRepo = {
      create: jest.fn(data => Promise.resolve({ id: 1, ...data }))
    };
    mockMapRepo = {
      findById: jest.fn()
    };
    mockObstacleRepo = {
      findAllByMapId: jest.fn(() => Promise.resolve([]))
    };
    mockWaypointRepo = {
      findAllByMapId: jest.fn(() => Promise.resolve([]))
    };
    
    routeService = createRouteService(
      mockRouteRepo,
      mockMapRepo,
      mockObstacleRepo,
      mockWaypointRepo
    );
  });

  test('Debe fallar si el Mapa no existe (Punto 6)', async () => {
    mockMapRepo.findById.mockResolvedValue(null);
    
    const result = await routeService.calculateRoute({
      mapId: 999,
      start: { x: 0, y: 0 },
      end: { x: 5, y: 5 }
    });
    
    expect(result.isError).toBe(true);
    expect(result.error).toContain('no encontrado');
  });

  test('Debe calcular y guardar ruta pasando por Waypoints (Puntos 10, 11, 12)', async () => {
    mockMapRepo.findById.mockResolvedValue({ width: 10, height: 10 });
    mockWaypointRepo.findAllByMapId.mockResolvedValue([
      { x: 2, y: 2 },
      { x: 5, y: 5 }
    ]);
    
    const result = await routeService.calculateRoute({
      mapId: 1,
      start: { x: 0, y: 0 },
      end: { x: 8, y: 8 }
    });
    
    expect(result.isError).toBe(false);
    expect(result.value.optimized_path).toBeDefined();
    expect(result.value.distance).toBeGreaterThan(0);
    expect(mockRouteRepo.create).toHaveBeenCalled();
  });
});
