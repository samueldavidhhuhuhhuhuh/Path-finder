
const IReadRepository = require('../interfaces/IReadRepository');

class WaypointRepository extends IReadRepository {
  constructor(WaypointModel) {
    super();
    this.WaypointModel = WaypointModel;
  }

  async create(data) {
    return await this.WaypointModel.create(data);
  }

  async findById(id) {
    return await this.WaypointModel.findByPk(id);
  }

  async findAll() {
    return await this.WaypointModel.findAll();
  }

  async findAllByMapId(mapId) {
    return await this.WaypointModel.findAll({ where: { mapId } });
  }

  async update(id, data) {
    const [rows] = await this.WaypointModel.update(data, { where: { id } });
    return rows > 0;
  }

  async delete(id) {
    return await this.WaypointModel.destroy({ where: { id } });
  }
}

const createWaypointRepository = (WaypointModel) => new WaypointRepository(WaypointModel);

module.exports = createWaypointRepository;
