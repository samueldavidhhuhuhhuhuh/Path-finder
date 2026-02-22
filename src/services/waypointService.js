
const Result = require('../utils/result');

class WaypointService {
  constructor(waypointRepository) {
    this.waypointRepository = waypointRepository;
  }

  async createWaypoint(data) {
    try {
      if (!data.mapId || data.x === undefined || data.y === undefined) {
        return Result.fail("mapId, x, y son requeridos");
      }

      const waypoint = await this.waypointRepository.create(data);
      return Result.ok(waypoint);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getAllWaypoints() {
    try {
      const waypoints = await this.waypointRepository.findAll();
      return Result.ok(waypoints);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getWaypointById(id) {
    try {
      const waypoint = await this.waypointRepository.findById(id);
      if (!waypoint) {
        return Result.fail("Waypoint no encontrado");
      }
      return Result.ok(waypoint);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async updateWaypoint(id, data) {
    try {
      const updated = await this.waypointRepository.update(id, data);
      if (!updated) {
        return Result.fail("Waypoint no encontrado");
      }
      const waypoint = await this.waypointRepository.findById(id);
      return Result.ok(waypoint);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async deleteWaypoint(id) {
    try {
      const deleted = await this.waypointRepository.delete(id);
      if (!deleted) {
        return Result.fail("Waypoint no encontrado");
      }
      return Result.ok({ message: "Waypoint eliminado" });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

const createWaypointService = (waypointRepository) => new WaypointService(waypointRepository);

module.exports = createWaypointService;
