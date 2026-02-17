/**
 * Interface Segregation Principle (ISP)
 * Interfaz específica para operaciones de lectura
 */
class IReadRepository {
  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll() {
    throw new Error('Method not implemented');
  }
}

module.exports = IReadRepository;
