/**
 * Dependency Inversion Principle (DIP)
 * MapService depende de abstracciones (interfaces) no de implementaciones concretas
 * 
 * Single Responsibility Principle (SRP)
 * Delegamos validación y transformación a clases especializadas
 */
const Result = require('../utils/result');
const MapDataValidator = require('../validators/MapDataValidator');
const MapDataTransformer = require('../transformers/MapDataTransformer');

class MapService {
  constructor(mapRepository) {
    this.mapRepository = mapRepository;
  }

  async createMap(data) {
    try {
      // Validación delegada
      const validation = MapDataValidator.validateCreateData(data);
      if (!validation.isValid) {
        return Result.fail(validation.errors.join(', '));
      }

      // Transformación delegada
      const mapToPersist = MapDataTransformer.toCreateDTO(data);

      // Persistencia
      const savedMap = await this.mapRepository.create(mapToPersist);

      // Transformación de respuesta
      const response = MapDataTransformer.toResponseDTO(savedMap);

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getAllMaps() {
    try {
      const maps = await this.mapRepository.findAll();
      const response = maps.map(map => MapDataTransformer.toResponseDTO(map));
      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async getMapById(id) {
    try {
      const map = await this.mapRepository.findById(id);
      if (!map) {
        return Result.fail("Mapa no encontrado");
      }
      const response = MapDataTransformer.toResponseDTO(map);
      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async updateMap(id, data) {
    try {
      const existingMap = await this.mapRepository.findById(id);
      if (!existingMap) {
        return Result.fail("Mapa no encontrado");
      }

      // Validación delegada
      const validation = MapDataValidator.validateUpdateData(data, existingMap);
      if (!validation.isValid) {
        return Result.fail(validation.errors.join(', '));
      }

      // Transformación delegada
      const mapToUpdate = MapDataTransformer.toUpdateDTO(data);

      // Actualización
      await this.mapRepository.update(id, mapToUpdate);

      // Obtener datos actualizados
      const updatedMap = await this.mapRepository.findById(id);
      const response = MapDataTransformer.toResponseDTO(updatedMap);

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error.message);
    }
  }

  async deleteMap(id) {
    try {
      const deletedCount = await this.mapRepository.delete(id);
      if (deletedCount === 0) {
        return Result.fail("Mapa no encontrado para eliminar");
      }
      return Result.ok({ message: "Mapa eliminado correctamente" });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}

const createMapService = (mapRepository) => new MapService(mapRepository);

module.exports = createMapService;
