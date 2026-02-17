/**
 * RouteController con manejo de errores usando Result Monad
 */
class RouteController {
  constructor(routeService) {
    this.routeService = routeService;
  }

  calculate = async (req, res) => {
    const result = await this.routeService.calculateRoute(req.body);
    
    result.match({
      ok: (route) => res.status(201).json(route),
      fail: (error) => {
        const status = error.includes("no encontrado") ? 404 : 400;
        res.status(status).json({ error });
      }
    });
  }

  getOne = async (req, res) => {
    const result = await this.routeService.getRoute(req.params.id);
    
    result.match({
      ok: (route) => res.status(200).json(route),
      fail: (error) => res.status(404).json({ error })
    });
  }

  getAll = async (req, res) => {
    const result = await this.routeService.getAllRoutes();
    
    result.match({
      ok: (routes) => res.status(200).json(routes),
      fail: (error) => res.status(500).json({ error })
    });
  }
}

const createRouteController = (routeService) => new RouteController(routeService);

module.exports = createRouteController;
