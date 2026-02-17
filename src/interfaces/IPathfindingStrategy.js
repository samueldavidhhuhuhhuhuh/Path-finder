/**
 * Open/Closed Principle (OCP)
 * Interfaz base para estrategias de búsqueda de rutas
 * Permite agregar nuevos algoritmos sin modificar código existente
 */
class IPathfindingStrategy {
  findPath(width, height, obstacles, start, end) {
    throw new Error('Method not implemented');
  }

  getName() {
    throw new Error('Method not implemented');
  }
}

module.exports = IPathfindingStrategy;
