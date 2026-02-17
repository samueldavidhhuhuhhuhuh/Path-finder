/**
 * RouteRepository refactorizado con LSP
 */
const IReadRepository = require('../interfaces/IReadRepository');

class RouteRepository extends IReadRepository {
  constructor(RouteModel) {
    super();
    this.RouteModel = RouteModel;
  }

  async create(data) {
    return await this.RouteModel.create(data);
  }

  async findById(id) {
    return await this.RouteModel.findByPk(id);
  }

  async findAll() {
    return await this.RouteModel.findAll();
  }

  async update(id, data) {
    const [rows] = await this.RouteModel.update(data, { where: { id } });
    return rows > 0;
  }

  async delete(id) {
    return await this.RouteModel.destroy({ where: { id } });
  }
}

const createRouteRepository = (RouteModel) => new RouteRepository(RouteModel);

module.exports = createRouteRepository;
