
class ObstacleController {
  constructor(obstacleService) {
    this.obstacleService = obstacleService;
  }

  create = async (req, res) => {
    const result = await this.obstacleService.createObstacle(req.body);
    
    result.match({
      ok: (obstacle) => res.status(201).json(obstacle),
      fail: (error) => res.status(400).json({ error })
    });
  }

  getAll = async (req, res) => {
    const result = await this.obstacleService.getAllObstacles();
    
    result.match({
      ok: (obstacles) => res.status(200).json(obstacles),
      fail: (error) => res.status(500).json({ error })
    });
  }

  getOne = async (req, res) => {
    const result = await this.obstacleService.getObstacleById(req.params.id);
    
    result.match({
      ok: (obstacle) => res.status(200).json(obstacle),
      fail: (error) => res.status(404).json({ error })
    });
  }

  update = async (req, res) => {
    const result = await this.obstacleService.updateObstacle(req.params.id, req.body);
    
    result.match({
      ok: (obstacle) => res.status(200).json(obstacle),
      fail: (error) => {
        const status = error.includes("no encontrado") ? 404 : 400;
        res.status(status).json({ error });
      }
    });
  }

  delete = async (req, res) => {
    const result = await this.obstacleService.deleteObstacle(req.params.id);
    
    result.match({
      ok: (response) => res.status(200).json(response),
      fail: (error) => res.status(404).json({ error })
    });
  }
}

const createObstacleController = (obstacleService) => new ObstacleController(obstacleService);

module.exports = createObstacleController;
