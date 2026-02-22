
const IReadRepository = require('../interfaces/IReadRepository');

class ObstacleRepository extends IReadRepository {
  constructor(ObstacleModel) {
    super();
    this.ObstacleModel = ObstacleModel;
  }

  async create(data) {
    return await this.ObstacleModel.create(data);
  }

  async findById(id) {
    return await this.ObstacleModel.findByPk(id);
  }

  async findAll() {
    return await this.ObstacleModel.findAll();
  }

  async findAllByMapId(mapId) {
    return await this.ObstacleModel.findAll({ where: { mapId } });
  }

  async update(id, data) {
    const [rows] = await this.ObstacleModel.update(data, { where: { id } });
    return rows > 0;
  }

  async delete(id) {
    return await this.ObstacleModel.destroy({ where: { id } });
  }
}

const createObstacleRepository = (ObstacleModel) => new ObstacleRepository(ObstacleModel);

module.exports = createObstacleRepository;
