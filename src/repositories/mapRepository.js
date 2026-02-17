/**
 * Liskov Substitution Principle (LSP)
 * MapRepository implementa las interfaces de lectura y escritura
 * manteniendo la firma de los métodos consistente
 */
const IReadRepository = require('../interfaces/IReadRepository');
const IWriteRepository = require('../interfaces/IWriteRepository');

class MapRepository extends IReadRepository {
  constructor(MapModel) {
    super();
    this.MapModel = MapModel;
  }

  async create(mapData) {
    const newMap = await this.MapModel.create(mapData);
    return newMap;
  }

  async findById(id) {
    return await this.MapModel.findByPk(id);
  }

  async findAll() {
    return await this.MapModel.findAll();
  }

  async update(id, data) {
    const [affectedRows] = await this.MapModel.update(data, { where: { id } });
    return affectedRows > 0;
  }

  async delete(id) {
    return await this.MapModel.destroy({ where: { id } });
  }
}

const createMapRepository = (MapModel) => new MapRepository(MapModel);

module.exports = createMapRepository;
