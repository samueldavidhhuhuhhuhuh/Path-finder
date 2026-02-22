 
const DimensionValidator = require('./DimensionValidator');

class MapDataValidator {
  static validateCreateData(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string') {
      errors.push('El nombre es requerido y debe ser un string');
    }

    const width = data.dimensions?.width || data.width;
    const height = data.dimensions?.height || data.height;

    const dimensionValidation = DimensionValidator.validate(width, height);
    if (!dimensionValidation.isValid) {
      errors.push(dimensionValidation.error);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateData(data, existingMap) {
    const errors = [];

    if (data.name !== undefined && typeof data.name !== 'string') {
      errors.push('El nombre debe ser un string');
    }

    const width = data.dimensions?.width || data.width;
    const height = data.dimensions?.height || data.height;

    if (width || height) {
      const finalW = width || existingMap.width;
      const finalH = height || existingMap.height;

      const dimensionValidation = DimensionValidator.validate(finalW, finalH);
      if (!dimensionValidation.isValid) {
        errors.push(dimensionValidation.error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = MapDataValidator;
