
const Result = require('../utils/result');

class ObstacleService {
  constructor(obstacleRepository) {
    this.obstacleRepository = obstacleRepository;
  }

  async createObstacle(data) {
    try {
      if (!data.mapId || data.x === undefined || data.y === undefined) {
        return Result.fail("mapId, x, y son requeridos");
      }

      const obstacle = await this.obstacleRepository.create(data);
      return Result.ok(obstacle);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getAllObstacles() {
    try {
      const obstacles = await this.obstacleRepository.findAll();
      return Result.ok(obstacles);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getObstacleById(id) {
    try {
      const obstacle = await this.obstacleRepository.findById(id);
      if (!obstacle) {
        return Result.fail("Obstáculo no encontrado");
      }
      return Result.ok(obstacle);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async updateObstacle(id, data) {
    try {
      const updated = await this.obstacleRepository.update(id, data);
      if (!updated) {
        return Result.fail("Obstáculo no encontrado");
      }
      const obstacle = await this.obstacleRepository.findById(id);
      return Result.ok(obstacle);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async deleteObstacle(id) {
    try {
      const deleted = await this.obstacleRepository.delete(id);
      if (!deleted) {
        return Result.fail("Obstáculo no encontrado");
      }
      return Result.ok({ message: "Obstáculo eliminado" });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

const createObstacleService = (obstacleRepository) => new ObstacleService(obstacleRepository);

module.exports = createObstacleService;
