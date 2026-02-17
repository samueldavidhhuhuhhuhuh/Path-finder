/**
 * Interface Segregation Principle (ISP)
 * Interfaz específica para operaciones de escritura/modificación
 */
class IWriteRepository {
  async create(data) {
    throw new Error('Method not implemented');
  }

  async update(id, data) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = IWriteRepository;
