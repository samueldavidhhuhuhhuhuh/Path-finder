
const IReadRepository = require('../interfaces/IReadRepository');
const IWriteRepository = require('../interfaces/IWriteRepository');

class UserRepository extends IReadRepository {
  constructor(UserModel) {
    super();
    this.UserModel = UserModel;
  }

  async create(data) {
    return await this.UserModel.create(data);
  }

  async findById(id) {
    return await this.UserModel.findByPk(id);
  }

  async findAll() {
    return await this.UserModel.findAll();
  }

  async update(id, data) {
    const [rows] = await this.UserModel.update(data, { where: { id } });
    return rows > 0;
  }

  async delete(id) {
    return await this.UserModel.destroy({ where: { id } });
  }
}

const createUserRepository = (UserModel) => new UserRepository(UserModel);

module.exports = createUserRepository;
