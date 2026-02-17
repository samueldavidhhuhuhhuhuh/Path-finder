/**
 * WaypointController refactorizado con Result Monad
 */
class WaypointController {
  constructor(waypointService) {
    this.waypointService = waypointService;
  }

  create = async (req, res) => {
    const result = await this.waypointService.createWaypoint(req.body);
    
    result.match({
      ok: (waypoint) => res.status(201).json(waypoint),
      fail: (error) => res.status(400).json({ error })
    });
  }

  getAll = async (req, res) => {
    const result = await this.waypointService.getAllWaypoints();
    
    result.match({
      ok: (waypoints) => res.status(200).json(waypoints),
      fail: (error) => res.status(500).json({ error })
    });
  }

  getOne = async (req, res) => {
    const result = await this.waypointService.getWaypointById(req.params.id);
    
    result.match({
      ok: (waypoint) => res.status(200).json(waypoint),
      fail: (error) => res.status(404).json({ error })
    });
  }

  update = async (req, res) => {
    const result = await this.waypointService.updateWaypoint(req.params.id, req.body);
    
    result.match({
      ok: (waypoint) => res.status(200).json(waypoint),
      fail: (error) => {
        const status = error.includes("no encontrado") ? 404 : 400;
        res.status(status).json({ error });
      }
    });
  }

  delete = async (req, res) => {
    const result = await this.waypointService.deleteWaypoint(req.params.id);
    
    result.match({
      ok: (response) => res.status(200).json(response),
      fail: (error) => res.status(404).json({ error })
    });
  }
}

const createWaypointController = (waypointService) => new WaypointController(waypointService);

module.exports = createWaypointController;
